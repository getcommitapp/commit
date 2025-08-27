import { OpenAPIRoute } from "chanfana";
import {
  GroupCreateRequestSchema,
  GroupCreateResponseSchema,
} from "@commit/types";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, GroupParticipants, Session } from "../db/schema";

export class GroupCreate extends OpenAPIRoute {
  // schema with minimal info per request: tags, summary, and 200 response description
  schema = {
    tags: ["Groups"],
    summary: "Create a new group",
    request: {
      body: {
        content: {
          "application/json": {
            schema: GroupCreateRequestSchema,
          },
        },
      },
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
    const { name } = data.body;

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

    const id = crypto.randomUUID();
    const inviteCode = Math.random().toString(36).slice(2, 10).toUpperCase();
    const now = new Date();

    await db
      .insert(Group)
      .values({
        id,
        creatorId: session.userId,
        name,
        inviteCode,
        updatedAt: now,
      })
      .run?.();

    // Add creator as participant
    await db
      .insert(GroupParticipants)
      .values({
        groupId: id,
        userId: session.userId,
        joinedAt: now,
        updatedAt: now,
      })
      .run?.();

    const created = await db.select().from(Group).where(eq(Group.id, id)).get();
    if (!created) return new Response("Failed to create", { status: 500 });

    return {
      id: created.id,
      name: created.name,
      description: created.description ?? null,
      goalId: created.goalId ?? null,
      inviteCode: created.inviteCode,
      createdAt: (created.createdAt as Date).toISOString(),
      updatedAt: (created.updatedAt as Date).toISOString(),
    };
  }
}
