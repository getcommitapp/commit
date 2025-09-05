import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { Group, Goal, GroupMember, GoalOccurrence } from "../db/schema";
import { GroupDeleteResponseSchema } from "@commit/types";
import { todayLocal, computeState } from "../services/goalService";

export class GroupsDelete extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Delete a group and its associated goal (owner only)",
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        schema: {
          type: "string" as const,
        },
        description: "Group ID",
      },
    ],
    responses: {
      "200": {
        description: "Group and goal deleted",
        content: {
          "application/json": {
            schema: GroupDeleteResponseSchema,
          },
        },
      },
      "400": { description: "Bad Request" },
      "403": { description: "Forbidden" },
      "404": { description: "Not Found" },
      "409": {
        description:
          "Conflict - cannot delete group while goal is in active state",
      },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);
    const user = c.var.user!;
    const userId = user.id;
    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!g) return new Response("Not Found", { status: 404 });
    if (g.creatorId !== userId)
      return new Response("Forbidden", { status: 403 });

    // Get the associated goal to check its state
    const goal = await db
      .select()
      .from(Goal)
      .where(eq(Goal.id, g.goalId))
      .get();
    if (!goal) return new Response("Goal not found", { status: 404 });

    // Check goal state - prevent deletion if goal is in active states
    const localDate = todayLocal(user.timezone);
    const occurrence = await db
      .select()
      .from(GoalOccurrence)
      .where(
        and(
          eq(GoalOccurrence.goalId, g.goalId),
          eq(GoalOccurrence.userId, userId),
          eq(GoalOccurrence.occurrenceDate, localDate)
        )
      )
      .get();

    const goalState = computeState(goal, user, occurrence || null);
    const activeStates = [
      "scheduled",
      "window_open",
      "ongoing",
      "awaiting_verification",
    ];

    if (activeStates.includes(goalState.state)) {
      return new Response(
        `Cannot delete group while the goal is in "${goalState.state}" state`,
        { status: 409 }
      );
    }

    // Delete goal occurrences linked to this group's goal
    await db.delete(GoalOccurrence).where(eq(GoalOccurrence.goalId, g.goalId));

    // Delete the associated goal
    await db.delete(Goal).where(eq(Goal.id, g.goalId));

    // Explicitly delete group membership rows (in case cascades are not enforced)
    await db.delete(GroupMember).where(eq(GroupMember.groupId, id));

    // Delete the group
    await db.delete(Group).where(eq(Group.id, id));

    return c.json({ message: "Group and associated goal deleted." });
  }
}
