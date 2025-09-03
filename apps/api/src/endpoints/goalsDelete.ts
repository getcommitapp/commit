import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalDeleteResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import { todayLocal, computeState } from "../services/goalService";

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

    // Check goal state - prevent deletion if goal is in active states
    const localDate = todayLocal(user.timezone);
    const [occurrence] = await db
      .select()
      .from(schema.GoalOccurrence)
      .where(
        and(
          eq(schema.GoalOccurrence.goalId, goalId),
          eq(schema.GoalOccurrence.userId, user.id),
          eq(schema.GoalOccurrence.occurrenceDate, localDate)
        )
      )
      .limit(1);

    const goalState = computeState(existingGoal, user, occurrence || null);
    const activeStates = [
      "scheduled",
      "window_open",
      "ongoing",
      "awaiting_verification",
    ];

    if (activeStates.includes(goalState.state)) {
      return new Response(
        `Cannot delete goal while it is in "${goalState.state}" state`,
        { status: 409 }
      );
    }

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
