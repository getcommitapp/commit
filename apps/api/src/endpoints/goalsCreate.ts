import { OpenAPIRoute, contentJson } from "chanfana";
import { type AppContext } from "../types";
import {
  GoalCreateRequestSchema,
  GoalCreateResponseSchema,
} from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { v7 as uuid } from "uuid";

export class GoalsCreate extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Create a new Goal",
    request: {
      body: contentJson(GoalCreateRequestSchema),
    },
    responses: {
      "200": {
        description: "Returns the created goal",
        content: {
          "application/json": {
            schema: GoalCreateResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const goalToCreate = data.body;

    const user = c.var.user!;
    const db = drizzle(c.env.DB, { schema });
    const id = uuid();

    // Create the goal in the db
    const now = new Date();
    const [created] = await db
      .insert(schema.Goal)
      .values({
        id: id,
        ownerId: user.id,
        name: goalToCreate.name,
        description: goalToCreate.description ?? null,
        startDate: new Date(goalToCreate.startDate),
        endDate: goalToCreate.endDate ? new Date(goalToCreate.endDate) : null,
        dueStartTime: new Date(goalToCreate.dueStartTime),
        dueEndTime: goalToCreate.dueEndTime
          ? new Date(goalToCreate.dueEndTime)
          : null,
        recurrence: goalToCreate.recurrence ?? null,
        stakeCents: goalToCreate.stakeCents,
        currency: "CHF",
        destinationType: goalToCreate.destinationType,
        destinationUserId: goalToCreate.destinationUserId ?? null,
        destinationCharityId: goalToCreate.destinationCharityId ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Optional single verification method (only allow specific methods)
    if (goalToCreate.verificationMethod) {
      try {
        const vm = goalToCreate.verificationMethod;
        await db.insert(schema.GoalVerificationsMethod).values({
          id: uuid(),
          goalId: created.id,
          method: vm.method,
          latitude: vm.latitude ?? null,
          longitude: vm.longitude ?? null,
          radiusM: vm.radiusM ?? null,
          durationSeconds: vm.durationSeconds ?? null,
          graceTime: vm.graceTime ? new Date(vm.graceTime) : null,
          createdAt: now,
          updatedAt: now,
        });
        // Insert succeeded; verification not included in response payload
      } catch (e) {
        console.error("[GoalsCreate] Failed to insert verification method", e);
      }
    }

    return c.json(created, 200);
  }
}
