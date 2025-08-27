import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, GroupParticipants } from "../db/schema";

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

    const res = Array.from(map.values()).map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description ?? null,
      goalId: g.goalId ?? null,
      inviteCode: g.inviteCode,
      createdAt: (g.createdAt as Date).toISOString(),
      updatedAt: (g.updatedAt as Date).toISOString(),
    }));

    return res;
  }
}
