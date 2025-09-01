import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { todayLocal, computeState } from "../services/goalService";

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
    const db = drizzle(c.env.DB, { schema });

    // Get user's personal goals
    const personalGoals = await db.query.Goal.findMany({
      where: eq(schema.Goal.ownerId, user.id),
    });

    // Get groups that the user is a member of
    const userGroups = await db.query.GroupMember.findMany({
      where: eq(schema.GroupMember.userId, user.id),
      with: {
        group: {
          with: {
            goal: true,
          },
        },
      },
    });

    // Extract group goals and create a map for groupId lookup
    const groupGoals: Array<typeof personalGoals[0] & { groupId: string }> = [];
    const goalGroupMap = new Map<string, string>();

    for (const membership of userGroups) {
      if (membership.group.goal) {
        groupGoals.push({
          ...membership.group.goal,
          groupId: membership.group.id,
        });
        goalGroupMap.set(membership.group.goal.id, membership.group.id);
      }
    }

    // Combine all goals, avoiding duplicates (in case user owns a goal that's also in a group)
    const allGoalIds = new Set<string>();
    const allGoals: Array<typeof personalGoals[0] & { groupId: string | null }> = [];

    // Add personal goals first
    for (const goal of personalGoals) {
      if (!allGoalIds.has(goal.id)) {
        allGoals.push({ ...goal, groupId: goalGroupMap.get(goal.id) || null });
        allGoalIds.add(goal.id);
      }
    }

    // Add group goals that aren't already included
    for (const groupGoal of groupGoals) {
      if (!allGoalIds.has(groupGoal.id)) {
        allGoals.push(groupGoal);
        allGoalIds.add(groupGoal.id);
      }
    }

    const localDate = todayLocal(user.timezone);

    // Load today's occurrences for this user
    const occs = await db.query.GoalOccurrence.findMany({
      where: and(
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, localDate)
      ),
    });
    const occIndex = new Map(occs.map((o) => [o.goalId, o]));

    const results = allGoals.map((g) => {
      const occ = occIndex.get(g.id) || null;
      const cs = computeState(g, user, occ);
      return {
        ...g,
        state: cs.state,
        occurrence: cs.occurrence ?? null,
        actions: cs.actions,
        nextTransitionAt: cs.nextTransitionAt ?? null,
        groupId: g.groupId,
      };
    });

    return c.json(results, 200);
  }
}
