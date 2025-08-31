import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalDeleteResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class GoalsDelete extends OpenAPIRoute {
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
    const db = drizzle(c.env.DB, { schema });

    // Check if goal exists and user owns it
    const [existingGoal] = await db
      .select()
      .from(schema.Goal)
      .where(eq(schema.Goal.id, goalId))
      .limit(1);

    if (!existingGoal) return new Response("Not Found", { status: 404 });

    if (existingGoal.ownerId !== user.id)
      return new Response("Forbidden", { status: 403 });

    // Prevent delete if goal is linked to a group
    const [group] = await db
      .select({ id: schema.Group.id })
      .from(schema.Group)
      .where(eq(schema.Group.goalId, goalId))
      .limit(1);

    if (group) return new Response("Conflict", { status: 409 });

    // Delete the goal
    await db.delete(schema.Goal).where(eq(schema.Goal.id, goalId));

    return c.json({ message: "Goal deleted successfully." }, 200);
  }
}
