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
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        schema: {
          type: "string" as const,
        },
        description: "Group ID",
      },
    ],
    responses: {
      "200": {
        description: "Invite link created successfully",
        content: {
          "application/json": {
            schema: GroupInviteGetResponseSchema,
          },
        },
      },
      "400": { description: "Bad Request" },
      "403": { description: "Forbidden" },
      "404": { description: "Not Found" },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);
    const userId = c.var.user!.id;

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

    return c.json({ inviteCode: g.inviteCode });
  }
}
