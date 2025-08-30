import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { GoalTimerStartResponseSchema } from "@commit/types";

export class GoalsTimerStart extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Start a goal timer for the current user",
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        schema: { type: "string" as const },
        description: "Goal ID",
      },
    ],
    responses: {
      "200": {
        description: "Timer started or already running",
        content: {
          "application/json": { schema: GoalTimerStartResponseSchema },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const goalId = c.req.param("id");
    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    // Ensure goal exists and belongs to user
    const [goal] = await db
      .select({
        id: schema.Goal.id,
        ownerId: schema.Goal.ownerId,
        startDate: schema.Goal.startDate,
        dueStartTime: schema.Goal.dueStartTime,
        dueEndTime: schema.Goal.dueEndTime,
      })
      .from(schema.Goal)
      .where(eq(schema.Goal.id, goalId))
      .limit(1);
    if (!goal) return c.json({ error: "Goal not found" }, 404);
    if (goal.ownerId !== user.id) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Ensure the goal has at least one verification method with a duration
    const [vm] = await db
      .select({ id: schema.GoalVerificationsMethod.id })
      .from(schema.GoalVerificationsMethod)
      .where(
        and(
          eq(schema.GoalVerificationsMethod.goalId, goalId),
          isNotNull(schema.GoalVerificationsMethod.durationSeconds)
        )
      )
      .limit(1);
    if (!vm) {
      return c.json(
        {
          error:
            "Timer not allowed: goal has no verification method with duration",
        },
        400
      );
    }

    const now = new Date();

    // Prevent starting outside allowed window
    if (!goal.startDate || !goal.dueStartTime || !goal.dueEndTime) {
      return c.json({ error: "Timer not allowed: schedule incomplete" }, 400);
    }
    const start = new Date(goal.startDate);
    const dueStart = new Date(goal.dueStartTime);
    const dueEnd = new Date(goal.dueEndTime);
    const sameDate =
      now.getUTCFullYear() === start.getUTCFullYear() &&
      now.getUTCMonth() === start.getUTCMonth() &&
      now.getUTCDate() === start.getUTCDate();
    const withinWindow = sameDate && now >= dueStart && now <= dueEnd;
    if (!withinWindow) {
      return c.json(
        { error: "Timer not allowed: outside allowed window" },
        400
      );
    }

    // Upsert style: if an existing timer exists, return it, else create
    const [existing] = await db
      .select()
      .from(schema.GoalTimer)
      .where(
        and(
          eq(schema.GoalTimer.goalId, goalId),
          eq(schema.GoalTimer.userId, user.id)
        )
      )
      .limit(1);

    if (existing) {
      // If not yet started, set startedAt now; else return it
      if (!existing.startedAt) {
        // Re-create the row with startedAt set
        await db
          .delete(schema.GoalTimer)
          .where(
            and(
              eq(schema.GoalTimer.goalId, goalId),
              eq(schema.GoalTimer.userId, user.id)
            )
          );
        const insertRow = {
          id: crypto.randomUUID(),
          goalId,
          userId: user.id,
          startedAt: now,
          createdAt: now,
        } as unknown as schema.GoalTimerInsert;
        await db.insert(schema.GoalTimer).values(insertRow);
        return c.json(
          {
            timer: { goalId, userId: user.id, startedAt: now.toISOString() },
            created: false,
          },
          200
        );
      }
      return c.json(
        {
          timer: {
            goalId: existing.goalId,
            userId: existing.userId,
            startedAt: new Date(existing.startedAt).toISOString(),
          },
          created: false,
        },
        200
      );
    }

    // Insert new row with startedAt
    const insertRow = {
      id: crypto.randomUUID(),
      goalId,
      userId: user.id,
      startedAt: now,
      createdAt: now,
    } as unknown as schema.GoalTimerInsert;
    await db.insert(schema.GoalTimer).values(insertRow);

    const payload = { goalId, userId: user.id, startedAt: now.toISOString() };

    return c.json({ timer: payload, created: true }, 200);
  }
}
