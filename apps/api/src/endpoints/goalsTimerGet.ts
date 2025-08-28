import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { and, eq } from "drizzle-orm";
import { GoalTimerGetResponseSchema } from "@commit/types";

export class GoalsTimerGet extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Get current goal timer for the user",
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
        description: "Current timer or null",
        content: { "application/json": { schema: GoalTimerGetResponseSchema } },
      },
    },
  };

  async handle(c: AppContext) {
    const goalId = c.req.param("id");
    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    const [row] = await db
      .select()
      .from(schema.GoalTimer)
      .where(
        and(
          eq(schema.GoalTimer.goalId, goalId),
          eq(schema.GoalTimer.userId, user.id)
        )
      )
      .limit(1);

    if (!row) return c.json({ timer: null }, 200);

    const payload = {
      goalId: row.goalId,
      userId: row.userId,
      startedAt: row.startedAt ? new Date(row.startedAt).toISOString() : null,
    };

    return c.json({ timer: payload }, 200);
  }
}
