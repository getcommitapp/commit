import { OpenAPIRoute, contentJson } from "chanfana";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import type { AppContext } from "../types";
import { Group, GroupMember } from "../db/schema";
import { GroupJoinRequestSchema, GroupJoinResponseSchema } from "@commit/types";

export class GroupsJoin extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Join a group using an invite code",
    request: { body: contentJson(GroupJoinRequestSchema) },
    responses: {
      "200": {
        description: "Joined group",
        content: { "application/json": { schema: GroupJoinResponseSchema } },
      },
      "400": { description: "Bad request" },
      "401": { description: "Unauthorized" },
      "404": { description: "Invalid code" },
      "409": { description: "Already a member" },
    },
  };

  async handle(c: AppContext) {
    const userId = c.var.user!.id;

    const data = await this.getValidatedData<typeof this.schema>();
    const { code } = data.body;

    // Validate that code is not empty
    if (!code || code.trim() === "") {
      return new Response("Code is required", { status: 400 });
    }

    const db = drizzle(c.env.DB);

    const g = await db
      .select()
      .from(Group)
      .where(eq(Group.inviteCode, code))
      .get();
    if (!g) return new Response("Invalid code", { status: 404 });

    // Already member?
    const existing = await db
      .select()
      .from(GroupMember)
      .where(and(eq(GroupMember.groupId, g.id), eq(GroupMember.userId, userId)))
      .get();
    if (existing) return new Response("Already a member", { status: 409 });

    const now = new Date();
    await db.insert(GroupMember).values({
      groupId: g.id,
      userId,
      joinedAt: now,
      updatedAt: now,
    });

    return c.json({
      id: g.id,
      name: g.name,
      description: g.description ?? null,
      inviteCode: g.inviteCode,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    });
  }
}
