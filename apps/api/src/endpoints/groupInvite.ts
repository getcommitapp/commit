import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupInviteGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, Session } from "../db/schema";

export class GroupInvite extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Create an invite link for a group",
    responses: {
      "200": {
        description: "Invite link created successfully",
        content: {
          "application/json": {
            schema: GroupInviteGetResponseSchema,
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

    const g = await db
      .select({ inviteCode: Group.inviteCode, creatorId: Group.creatorId })
      .from(Group)
      .where(eq(Group.id, id))
      .get();
    if (!g) return new Response("Not Found", { status: 404 });
    if (g.creatorId !== session.userId)
      return new Response("Forbidden", { status: 403 });

    return { inviteCode: g.inviteCode };
  }
}
