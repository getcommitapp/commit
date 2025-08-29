import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, isNotNull, inArray } from "drizzle-orm";

export class GoalsList extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "List Goals",
    responses: {
      "200": {
        description: "Returns a list of goals",
        content: {
          "application/json": {
            schema: GoalsListResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    // Get all goals owned by the current user
    const goals = await db
      .select()
      .from(schema.Goal)
      .where(eq(schema.Goal.ownerId, user.id));

    if (goals.length === 0) return c.json([], 200);

    // Find which of these goals have at least one verification method with a duration
    const goalIds = goals.map((g) => g.id);
    const methodsWithDuration = await db
      .select({ goalId: schema.GoalVerificationsMethod.goalId })
      .from(schema.GoalVerificationsMethod)
      .where(
        and(
          inArray(schema.GoalVerificationsMethod.goalId, goalIds),
          isNotNull(schema.GoalVerificationsMethod.durationSeconds)
        )
      );

    const goalsWithDuration = new Set(methodsWithDuration.map((m) => m.goalId));

    const response = goals.map((g) => ({
      ...g,
      hasDurationVerification: goalsWithDuration.has(g.id),
    }));

    return c.json(response, 200);
  }
}
