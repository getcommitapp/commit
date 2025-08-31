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

    // Create the goal in the db (flattened schema)
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
        dueStartTime: goalToCreate.dueStartTime
          ? new Date(goalToCreate.dueStartTime)
          : new Date(goalToCreate.startDate),
        dueEndTime: goalToCreate.dueEndTime
          ? new Date(goalToCreate.dueEndTime)
          : null,
        localDueStart: goalToCreate.localDueStart ?? null,
        localDueEnd: goalToCreate.localDueEnd ?? null,
        recDaysMask: goalToCreate.recDaysMask ?? null,
        stakeCents: goalToCreate.stakeCents,
        currency: "CHF",
        destinationType: goalToCreate.destinationType,
        destinationUserId: goalToCreate.destinationUserId ?? null,
        destinationCharityId: goalToCreate.destinationCharityId ?? null,
        method: goalToCreate.method,
        graceTimeSeconds: goalToCreate.graceTimeSeconds ?? null,
        durationSeconds: goalToCreate.durationSeconds ?? null,
        geoLat: goalToCreate.geoLat ?? null,
        geoLng: goalToCreate.geoLng ?? null,
        geoRadiusM: goalToCreate.geoRadiusM ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return c.json(created, 200);
  }
}
