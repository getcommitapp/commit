import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupLeaveResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { Group, GroupMember } from "../db/schema";

export class GroupsLeave extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Leave a group",
    responses: {
      "200": {
        description: "Left group successfully",
        content: {
          "application/json": {
            schema: GroupLeaveResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);
    const userId = c.var.user!.id;

    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!g) return new Response("Not Found", { status: 404 });
    if (g.creatorId === userId)
      return new Response("Creator cannot leave their own group", {
        status: 400,
      });

    await db
      .delete(GroupMember)
      .where(and(eq(GroupMember.groupId, id), eq(GroupMember.userId, userId)));

    return c.json({ message: "Left group successfully." });
  }
}
