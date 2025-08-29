import { OpenAPIRoute, contentJson } from "chanfana";
import {
  GroupCreateRequestSchema,
  GroupCreateResponseSchema,
} from "@commit/types";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

export class GroupsCreate extends OpenAPIRoute {
  // schema with minimal info per request: tags, summary, and 200 response description
  schema = {
    tags: ["Groups"],
    summary: "Create a new group",
    request: {
      body: contentJson(GroupCreateRequestSchema),
    },
    responses: {
      "200": {
        description: "Group created successfully",
        content: {
          "application/json": {
            schema: GroupCreateResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { name, description, goalId } = data.body;
    const db = drizzle(c.env.DB, { schema });
    const user = c.get("user");
    const userId = user?.id as string | undefined;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const id = crypto.randomUUID();
    const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const now = new Date();

    await db
      .insert(schema.Group)
      .values({
        id,
        creatorId: userId,
        goalId,
        name,
        description: description ?? null,
        inviteCode,
        createdAt: now,
        updatedAt: now,
      })
      .run?.();

    // Add creator as participant
    await db
      .insert(schema.GroupParticipants)
      .values({
        groupId: id,
        userId,
        joinedAt: now,
        updatedAt: now,
      })
      .run?.();

    const created = await db
      .select()
      .from(schema.Group)
      .where(eq(schema.Group.id, id))
      .get();
    if (!created) return new Response("Failed to create", { status: 500 });

    return c.json({
      id: created.id,
      name: created.name,
      description: created.description ?? null,
      inviteCode: created.inviteCode,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
