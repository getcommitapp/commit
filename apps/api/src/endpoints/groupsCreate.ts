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
    const userId = c.var.user.id;

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
        dueStartTime: new Date(goal.dueStartTime),
        dueEndTime: goal.dueEndTime ? new Date(goal.dueEndTime) : null,
        recurrence: goal.recurrence ?? null,
        stakeCents: goal.stakeCents,
        currency: "CHF",
        destinationType: goal.destinationType,
        destinationUserId: goal.destinationUserId ?? null,
        destinationCharityId: goal.destinationCharityId ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!createdGoal)
      return new Response("Failed to create goal", { status: 500 });

    // Optional verification method
    if (goal.verificationMethod) {
      const allowed = new Set(["location", "movement", "photo", "checkin"]);
      if (allowed.has(goal.verificationMethod.method)) {
        try {
          const vm = goal.verificationMethod;
          await db.insert(schema.GoalVerificationsMethod).values({
            id: uuid(),
            goalId: createdGoal.id,
            method: vm.method,
            latitude: vm.latitude ?? null,
            longitude: vm.longitude ?? null,
            radiusM: vm.radiusM ?? null,
            durationSeconds: vm.durationSeconds ?? null,
            graceTime: vm.graceTime ? new Date(vm.graceTime) : null,
            createdAt: now,
            updatedAt: now,
          });
        } catch (e) {
          console.error(
            "[GroupsCreate] Failed to insert verification method",
            e
          );
        }
      }
    }

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
    await db.insert(schema.GroupParticipants).values({
      groupId: id,
      userId,
      joinedAt: now,
      updatedAt: now,
    });

    return c.json(created);
  }
}
