import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq } from "drizzle-orm";
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
      .select({ id: schema.Goal.id, ownerId: schema.Goal.ownerId })
      .from(schema.Goal)
      .where(eq(schema.Goal.id, goalId))
      .limit(1);
    if (!goal) return c.json({ error: "Goal not found" }, 404);
    if (goal.ownerId !== user.id) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const now = new Date();

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
