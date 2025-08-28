import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, GroupParticipants } from "../db/schema";

export class GroupsFetch extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Get a group by id",
    responses: {
      "200": {
        description: "Returns the requested group",
        content: {
          "application/json": {
            schema: GroupGetResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);

    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!g) return new Response("Not Found", { status: 404 });

    const membersRows = await db
      .select({
        userId: GroupParticipants.userId,
        status: GroupParticipants.status,
        joinedAt: GroupParticipants.joinedAt,
      })
      .from(GroupParticipants)
      .where(eq(GroupParticipants.groupId, id))
      .all();

    const members = membersRows.map((m) => ({
      userId: m.userId,
      status: m.status ?? null,
      joinedAt: (m.joinedAt as Date).toISOString(),
    }));

    return {
      id: g.id,
      name: g.name,
      description: g.description ?? null,
      goalId: g.goalId ?? null,
      inviteCode: g.inviteCode,
      createdAt: (g.createdAt as Date).toISOString(),
      updatedAt: (g.updatedAt as Date).toISOString(),
      creatorId: g.creatorId,
      members,
    };
  }
}
