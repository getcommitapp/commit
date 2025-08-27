import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import { Goal } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

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
    const goals = await db.select().from(Goal).where(eq(Goal.ownerId, user.id));

    const response = goals.map((goal) => ({
      ...goal,
      startDate: goal.startDate?.toISOString(),
      endDate: goal.endDate?.toISOString() ?? null,
      dueStartTime: goal.dueStartTime?.toISOString(),
      dueEndTime: goal.dueEndTime?.toISOString() ?? null,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    }));

    return c.json(response, 200);
  }
}
