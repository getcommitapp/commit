import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupLeaveResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { Group, GroupMember, Goal, GoalOccurrence } from "../db/schema";
import { todayLocal, computeState } from "../services/goalService";

export class GroupsLeave extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Leave a group",
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
        description: "Left group successfully",
        content: {
          "application/json": {
            schema: GroupLeaveResponseSchema,
          },
        },
      },
      "400": { description: "Bad Request - creator cannot leave own group" },
      "404": { description: "Not Found" },
      "409": {
        description:
          "Conflict - cannot leave group while goal is in active state",
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
    if (g.creatorId === userId)
      return new Response("Creator cannot leave their own group", {
        status: 400,
      });

    // Get the associated goal to check its state
    const goal = await db
      .select()
      .from(Goal)
      .where(eq(Goal.id, g.goalId))
      .get();
    if (!goal) return new Response("Goal not found", { status: 404 });

    // Check goal state - prevent leaving if goal is in active states
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
        `Cannot leave group while the goal is in "${goalState.state}" state`,
        { status: 409 }
      );
    }

    await db
      .delete(GroupMember)
      .where(and(eq(GroupMember.groupId, id), eq(GroupMember.userId, userId)));

    return c.json({ message: "Left group successfully." });
  }
}
