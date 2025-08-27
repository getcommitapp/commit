import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalDeleteResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { Goal } from "../db/schema";
import { eq } from "drizzle-orm";

export class GoalDelete extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Delete a Goal",
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        schema: {
          type: "string" as const,
        },
        description: "Goal ID",
      },
    ],
    responses: {
      "200": {
        description: "Returns if the goal was deleted successfully",
        content: {
          "application/json": {
            schema: GoalDeleteResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const goalId = c.req.param("id");

    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    // Check if goal exists and user owns it
    const [existingGoal] = await db
      .select()
      .from(Goal)
      .where(eq(Goal.id, goalId))
      .limit(1);

    if (!existingGoal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    if (existingGoal.ownerId !== user.id) {
      return c.json({ error: "Unauthorized to delete this goal" }, 403);
    }

    // Delete the goal
    await db.delete(Goal).where(eq(Goal.id, goalId));

    return c.json({ message: "Goal deleted successfully." }, 200);
  }
}
