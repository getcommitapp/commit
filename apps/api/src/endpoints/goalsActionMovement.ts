import { OpenAPIRoute, contentJson } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq } from "drizzle-orm";
import {
  GoalActionResponseSchema,
  GoalMovementStartRequestSchema,
  GoalMovementStopRequestSchema,
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

export class GoalsActionMovementStop extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Stop movement timer for today's occurrence",
    request: { body: contentJson(GoalMovementStopRequestSchema) },
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
    await db
      .update(schema.GoalOccurrence)
      .set({ timerEndedAt: now, updatedAt: now })
      .where(
        and(
          eq(schema.GoalOccurrence.goalId, id),
          eq(schema.GoalOccurrence.userId, user.id),
          eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
        )
      );

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
