import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, exists, inArray, or } from "drizzle-orm";
import * as schema from "../db/schema";
import { todayLocal, computeState } from "../services/goalService";

export class GroupsList extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "List groups",
    responses: {
      "200": {
        description: "Returns a list of groups",
        content: {
          "application/json": {
            schema: GroupsListResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB, { schema });
    const userId = c.var.user!.id;

    const groups = await db.query.Group.findMany({
      with: {
        goal: true,
        creator: true,
        participants: {
          with: {
            user: true,
          },
        },
      },
      where: or(
        eq(schema.Group.creatorId, userId),
        exists(
          db
            .select({ one: schema.GroupMember.userId })
            .from(schema.GroupMember)
            .where(
              and(
                eq(schema.GroupMember.groupId, schema.Group.id),
                eq(schema.GroupMember.userId, userId)
              )
            )
        )
      ),
    });

    const tz = c.var.user.timezone;
    const localDate = todayLocal(tz);
    const goalIds = groups.map((g) => g.goal.id);
    const occs = goalIds.length
      ? await db.query.GoalOccurrence.findMany({
          where: and(
            inArray(schema.GoalOccurrence.goalId, goalIds),
            eq(schema.GoalOccurrence.userId, userId),
            eq(schema.GoalOccurrence.occurrenceDate, localDate)
          ),
        })
      : [];
    const occIndex = new Map(occs.map((o) => [o.goalId, o]));

    const response = await Promise.all(
      groups.map(async (g) => {
        const baseMembers = [
          { name: g.creator?.name || "Unknown", isOwner: true },
          ...g.participants
            .filter((p) => p.userId !== g.creatorId)
            .map((p) => ({ name: p.user?.name || "Unknown", isOwner: false })),
        ];

        const selfName = c.var.user.name;
        const hasSelf = baseMembers.some((m) => m.name === selfName);
        const members = hasSelf
          ? baseMembers
          : [
              ...baseMembers,
              { name: selfName, isOwner: g.creatorId === userId },
            ];

        const occ = occIndex.get(g.goal.id) || null;
        const status = computeState(g.goal, c.var.user, occ);
        return {
          ...g,
          memberCount: g.participants.length ?? 0,
          isOwner: g.creatorId === userId,
          members,
          goal: {
            ...g.goal,
            state: status.state,
            occurrence: status.occurrence ?? null,
            actions: status.actions,
            nextTransitionAt: status.nextTransitionAt ?? null,
          },
        };
      })
    );

    return c.json(response);
  }
}
