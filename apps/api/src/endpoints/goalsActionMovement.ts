import { OpenAPIRoute, contentJson } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq } from "drizzle-orm";
import {
  GoalActionResponseSchema,
  GoalMovementStartRequestSchema,
  GoalMovementViolateRequestSchema,
} from "@commit/types";
import { todayLocal, computeState } from "../services/goalService";

export class GoalsActionMovementStart extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Start movement timer for today's occurrence",
    request: { body: contentJson(GoalMovementStartRequestSchema) },
    responses: {
      "200": {
        description: "State after action",
        content: { "application/json": { schema: GoalActionResponseSchema } },
      },
      "404": { description: "Goal not found" },
      "403": { description: "Unauthorized" },
      "400": { description: "Invalid method for this action" },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const db = drizzle(c.env.DB, { schema });
    const { id } = c.req.param();
    const { body } = await this.getValidatedData<typeof this.schema>();

    const goal = await db.query.Goal.findFirst({
      where: eq(schema.Goal.id, id),
    });
    if (!goal) return new Response("Not Found", { status: 404 });

    // Check if user can act on this goal (owner or group member)
    let canAct = goal.ownerId === user.id;
    if (!canAct) {
      // Check if user is a member of any group that has this goal
      const groupMemberships = await db.query.GroupMember.findMany({
        where: eq(schema.GroupMember.userId, user.id),
        with: {
          group: true,
        },
      });
      canAct = groupMemberships.some(
        (membership) => membership.group.goalId === id
      );
    }

    if (!canAct) return new Response("Forbidden", { status: 403 });
    if (goal.method !== "movement")
      return new Response("Bad Request", { status: 400 });

    const occurrenceDate = body.occurrenceDate ?? todayLocal(user.timezone);
    const now = new Date();
    const existing = await db.query.GoalOccurrence.findFirst({
      where: and(
        eq(schema.GoalOccurrence.goalId, id),
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
      ),
    });
    if (existing) {
      await db
        .update(schema.GoalOccurrence)
        .set({ timerStartedAt: now, timerEndedAt: null, updatedAt: now })
        .where(
          and(
            eq(schema.GoalOccurrence.goalId, id),
            eq(schema.GoalOccurrence.userId, user.id),
            eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
          )
        );
    } else {
      await db.insert(schema.GoalOccurrence).values({
        goalId: id,
        userId: user.id,
        occurrenceDate,
        status: "pending",
        verifiedAt: null,
        timerStartedAt: now,
        timerEndedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    const occ = await db.query.GoalOccurrence.findFirst({
      where: and(
        eq(schema.GoalOccurrence.goalId, id),
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
      ),
    });
    const cs = computeState(goal, user, occ);
    return c.json({
      state: cs.state,
      occurrence: cs.occurrence ?? null,
      actions: cs.actions,
      nextTransitionAt: cs.nextTransitionAt ?? null,
    });
  }
}

// Removed explicit stop; violation handler will also reset timer fields

export class GoalsActionMovementViolate extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Mark movement violation for today's occurrence (auto-reject)",
    request: { body: contentJson(GoalMovementViolateRequestSchema) },
    responses: {
      "200": {
        description: "State after action",
        content: { "application/json": { schema: GoalActionResponseSchema } },
      },
      "404": { description: "Goal not found" },
      "403": { description: "Unauthorized" },
      "400": { description: "Invalid method for this action" },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const db = drizzle(c.env.DB, { schema });
    const { id } = c.req.param();
    const { body } = await this.getValidatedData<typeof this.schema>();

    const goal = await db.query.Goal.findFirst({
      where: eq(schema.Goal.id, id),
    });
    if (!goal) return new Response("Not Found", { status: 404 });

    // Check if user can act on this goal (owner or group member)
    let canAct = goal.ownerId === user.id;
    if (!canAct) {
      const groupMemberships = await db.query.GroupMember.findMany({
        where: eq(schema.GroupMember.userId, user.id),
        with: { group: true },
      });
      canAct = groupMemberships.some(
        (membership) => membership.group.goalId === id
      );
    }

    if (!canAct) return new Response("Forbidden", { status: 403 });
    if (goal.method !== "movement")
      return new Response("Bad Request", { status: 400 });

    const occurrenceDate = body.occurrenceDate ?? todayLocal(user.timezone);
    const now = new Date();

    // Upsert occurrence
    const existing = await db.query.GoalOccurrence.findFirst({
      where: and(
        eq(schema.GoalOccurrence.goalId, id),
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
      ),
    });

    if (!existing) {
      await db.insert(schema.GoalOccurrence).values({
        goalId: id,
        userId: user.id,
        occurrenceDate,
        status: "pending",
        verifiedAt: null,
        violated: false,
        timerStartedAt: null,
        timerEndedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Re-fetch for latest values
    let occ = await db.query.GoalOccurrence.findFirst({
      where: and(
        eq(schema.GoalOccurrence.goalId, id),
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
      ),
    });
    // Compute to know if we are within an active timer window
    let cs = computeState(goal, user, occ);

    // Always reset timer fields when violation is reported
    const resetFields = { timerStartedAt: null, timerEndedAt: null } as const;

    // Check if timer has completed its required duration
    const hasTimerCompleted = (() => {
      if (!occ?.timerStartedAt || !goal.durationSeconds) return false;
      const timerStarted = new Date(occ.timerStartedAt);
      const requiredDurationMs = goal.durationSeconds * 1000;
      const elapsedTime = now.getTime() - timerStarted.getTime();
      return elapsedTime >= requiredDurationMs;
    })();

    // Fail only if goal is currently ongoing/window_open for movement
    // OR awaiting_verification with active timer that hasn't completed its duration yet
    const shouldFail =
      goal.method === "movement" &&
      (cs.state === "ongoing" ||
        cs.state === "window_open" ||
        (cs.state === "awaiting_verification" && !hasTimerCompleted));

    // If timer completed, mark as approved; if should fail, mark as rejected; otherwise keep current status
    const newStatus =
      hasTimerCompleted && !shouldFail
        ? "approved"
        : shouldFail
          ? "rejected"
          : (occ?.status ?? "pending");

    const newVerifiedAt =
      (hasTimerCompleted && !shouldFail) || shouldFail
        ? now
        : (occ?.verifiedAt ?? null);

    await db
      .update(schema.GoalOccurrence)
      .set({
        violated: shouldFail,
        status: newStatus,
        verifiedAt: newVerifiedAt,
        updatedAt: now,
        ...resetFields,
      })
      .where(
        and(
          eq(schema.GoalOccurrence.goalId, id),
          eq(schema.GoalOccurrence.userId, user.id),
          eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
        )
      );

    // Recompute state with updated occurrence values
    occ = await db.query.GoalOccurrence.findFirst({
      where: and(
        eq(schema.GoalOccurrence.goalId, id),
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
      ),
    });
    cs = computeState(goal, user, occ);
    return c.json({
      state: cs.state,
      occurrence: cs.occurrence ?? null,
      actions: cs.actions,
      nextTransitionAt: cs.nextTransitionAt ?? null,
    });
  }
}
