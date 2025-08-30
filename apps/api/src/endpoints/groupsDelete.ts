import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group } from "../db/schema";
import { GroupDeleteResponseSchema } from "@commit/types";

export class GroupsDelete extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Delete a group (owner only)",
    responses: {
      "200": {
        description: "Group deleted",
        content: {
          "application/json": {
            schema: GroupDeleteResponseSchema,
          },
        },
      },
      "403": { description: "Forbidden" },
      "404": { description: "Not Found" },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);
    const userId = c.var.user!.id;
    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!g) return new Response("Not Found", { status: 404 });
    if (g.creatorId !== userId)
      return new Response("Forbidden", { status: 403 });

    await db.delete(Group).where(eq(Group.id, id)).run?.();

    return c.json({ message: "Group deleted." });
  }
}
