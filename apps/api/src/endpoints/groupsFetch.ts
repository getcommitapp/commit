import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { Group } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { GroupBaseSchema } from "@commit/types";

export class GroupsFetch extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Fetch a specific group by ID",
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
        description: "Returns the group",
        content: {
          "application/json": {
            schema: GroupBaseSchema,
          },
        },
      },
      "400": { description: "Bad Request" },
      "404": { description: "Group not found" },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);
    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const group = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!group) return new Response("Not Found", { status: 404 });

    return c.json(group);
  }
}
