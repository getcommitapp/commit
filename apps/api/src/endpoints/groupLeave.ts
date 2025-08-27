import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupLeaveResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { Group, GroupParticipants, Session } from "../db/schema";

export class GroupLeave extends OpenAPIRoute {
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
    const auth = c.req.header("Authorization");
    const token = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : undefined;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const session = await db
      .select({ userId: Session.userId })
      .from(Session)
      .where(eq(Session.token, token))
      .get();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const url = new URL(c.req.url);
    const match = url.pathname.match(/\/groups\/([^/]+)/);
    const id = match?.[1];
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!g) return new Response("Not Found", { status: 404 });
    if (g.creatorId === session.userId)
      return new Response("Creator cannot leave their own group", {
        status: 400,
      });

    await db
      .delete(GroupParticipants)
      .where(
        and(
          eq(GroupParticipants.groupId, id),
          eq(GroupParticipants.userId, session.userId)
        )
      )
      .run?.();

    return { message: "Left group successfully." };
  }
}
