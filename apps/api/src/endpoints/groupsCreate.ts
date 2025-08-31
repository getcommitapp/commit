import { OpenAPIRoute, contentJson } from "chanfana";
import {
  GroupCreateRequestSchema,
  GroupCreateResponseSchema,
} from "@commit/types";
import type { AppContext } from "../types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";

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
    const { name, description, goal } = data.body;
    const db = drizzle(c.env.DB, { schema });
    const userId = c.var.user!.id;

    const id = crypto.randomUUID();
    const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const now = new Date();

    // Create goal first using embedded payload
    const goalId = uuid();
    const [createdGoal] = await db
      .insert(schema.Goal)
      .values({
        id: goalId,
        ownerId: userId,
        name: goal.name,
        description: goal.description ?? null,
        startDate: new Date(goal.startDate),
        endDate: goal.endDate ? new Date(goal.endDate) : null,
        dueStartTime: goal.dueStartTime
          ? new Date(goal.dueStartTime)
          : new Date(goal.startDate),
        dueEndTime: goal.dueEndTime ? new Date(goal.dueEndTime) : null,
        localDueStart: goal.localDueStart ?? null,
        localDueEnd: goal.localDueEnd ?? null,
        recDaysMask: goal.recDaysMask ?? null,
        stakeCents: goal.stakeCents,
        currency: "CHF",
        destinationType: goal.destinationType,
        destinationUserId: goal.destinationUserId ?? null,
        destinationCharityId: goal.destinationCharityId ?? null,
        method: goal.method,
        graceTimeSeconds: goal.graceTimeSeconds ?? null,
        durationSeconds: goal.durationSeconds ?? null,
        geoLat: goal.geoLat ?? null,
        geoLng: goal.geoLng ?? null,
        geoRadiusM: goal.geoRadiusM ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!createdGoal)
      return new Response("Failed to create goal", { status: 500 });

    // Verification method is inline on goal in new model

    const [created] = await db
      .insert(schema.Group)
      .values({
        id,
        creatorId: userId,
        goalId: createdGoal.id,
        name,
        description: description ?? null,
        inviteCode,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Add creator as participant
    await db.insert(schema.GroupMember).values({
      groupId: id,
      userId,
      joinedAt: now,
      updatedAt: now,
    });

    return c.json(created);
  }
}
