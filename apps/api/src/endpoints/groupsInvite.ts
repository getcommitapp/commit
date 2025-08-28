import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupInviteGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group } from "../db/schema";

export class GroupsInvite extends OpenAPIRoute {
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
    const userId = c.get("user")?.id as string | undefined;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db
      .select({ inviteCode: Group.inviteCode, creatorId: Group.creatorId })
      .from(Group)
      .where(eq(Group.id, id))
      .get();
    if (!g) return new Response("Not Found", { status: 404 });
    if (g.creatorId !== userId)
      return new Response("Forbidden", { status: 403 });

    return { inviteCode: g.inviteCode };
  }
}
