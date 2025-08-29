import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema, type GroupSummary } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, GroupParticipants, Goal } from "../db/schema";

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
    const user = c.get("user");
    const userId = user?.id as string | undefined;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    // Groups where user is creator
    const created = await db
      .select()
      .from(Group)
      .where(eq(Group.creatorId, userId))
      .all();

    // Groups where user is a participant
    const joined = await db
      .select({
        group: Group,
      })
      .from(GroupParticipants)
      .innerJoin(Group, eq(GroupParticipants.groupId, Group.id))
      .where(eq(GroupParticipants.userId, userId))
      .all();

    const map = new Map<string, (typeof created)[number]>();
    for (const g of created) map.set(g.id, g);
    for (const j of joined) map.set(j.group.id, j.group);

    const res: GroupSummary[] = [];
    for (const g of map.values()) {
      const participantCount = await db
        .select({ id: GroupParticipants.userId })
        .from(GroupParticipants)
        .where(eq(GroupParticipants.groupId, g.id))
        .all();
      const memberCount = participantCount.length + 1; // include creator
      const base: GroupSummary = {
        id: g.id,
        name: g.name,
        description: g.description ?? null,
        goalId: g.goalId ?? null,
        inviteCode: g.inviteCode,
        createdAt:
          typeof g.createdAt === "string"
            ? g.createdAt
            : new Date(g.createdAt).toISOString(),
        updatedAt:
          typeof g.updatedAt === "string"
            ? g.updatedAt
            : new Date(g.updatedAt).toISOString(),
        memberCount,
      };

      if (g.goalId) {
        const goal = await db
          .select()
          .from(Goal)
          .where(eq(Goal.id, g.goalId))
          .get();
        if (goal) {
          base.goal = {
            id: goal.id,
            name: goal.name,
            startDate:
              typeof goal.startDate === "string"
                ? goal.startDate
                : new Date(goal.startDate).toISOString(),
            endDate: goal.endDate
              ? typeof goal.endDate === "string"
                ? goal.endDate
                : new Date(goal.endDate).toISOString()
              : null,
            stakeCents: goal.stakeCents,
            currency: goal.currency,
          };
        }
      }

      res.push(base);
    }

    return c.json(res);
  }
}
