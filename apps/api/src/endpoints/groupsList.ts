import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq, or, sql } from "drizzle-orm";
import { Group, GroupParticipants, Goal } from "../db/schema";
import { alias } from "drizzle-orm/sqlite-core";

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
    const db = drizzle(c.env.DB);
    const userId = c.var.user.id;

    // Single query using joins and aggregation
    const gpFilter = alias(GroupParticipants, "gpFilter");
    const gpAll = alias(GroupParticipants, "gpAll");

    const rows = await db
      .select({
        group: Group,
        goal: {
          id: Goal.id,
          name: Goal.name,
          startDate: Goal.startDate,
          endDate: Goal.endDate,
          stakeCents: Goal.stakeCents,
          currency: Goal.currency,
        },
        memberCount: sql<number>`count(distinct ${gpAll.userId}) + 1`,
      })
      .from(Group)
      .leftJoin(gpAll, eq(gpAll.groupId, Group.id))
      .leftJoin(Goal, eq(Goal.id, Group.goalId))
      .leftJoin(gpFilter, eq(gpFilter.groupId, Group.id))
      .where(or(eq(Group.creatorId, userId), eq(gpFilter.userId, userId)))
      .groupBy(Group.id)
      .all();

    const res = rows.map(({ group: g, goal, memberCount }) => ({
      id: g.id,
      name: g.name,
      description: g.description ?? null,
      goalId: g.goalId,
      inviteCode: g.inviteCode,
      createdAt: g.createdAt as unknown as string,
      updatedAt: g.updatedAt as unknown as string,
      memberCount: Number(memberCount ?? 1),
      goal: goal,
    }));

    return c.json(res);
  }
}
