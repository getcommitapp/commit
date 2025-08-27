import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import {
  GoalCreateRequestSchema,
  GoalCreateResponseSchema,
} from "@commit/types";
import { Goal } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { v7 as uuid } from "uuid";

export class GoalCreate extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Create a new Goal",
    request: {
      body: {
        content: {
          "application/json": {
            schema: GoalCreateRequestSchema,
          },
        },
      },
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
      "401": { description: "Unauthorized" },
      "500": { description: "Internal error" },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const goalToCreate = data.body;

    const user = c.var.user;
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = drizzle(c.env.DB);
    const id = uuid();

    const values: typeof Goal.$inferInsert = {
      id: id,
      ownerId: user.id,
      name: goalToCreate.name,
      description: "goalToCreate.description",
      startDate: new Date(goalToCreate.startDate),
      endDate: goalToCreate.endDate ? new Date(goalToCreate.endDate) : null,
      dueStartTime: goalToCreate.dueStartTime
        ? new Date(goalToCreate.dueStartTime)
        : null,
      dueEndTime: goalToCreate.dueEndTime
        ? new Date(goalToCreate.dueEndTime)
        : null,
      recurrence: goalToCreate.recurrence ?? null,
      stakeCents: goalToCreate.stakeCents ?? null,
      currency: goalToCreate.currency ?? null,
      destinationType: goalToCreate.destinationType ?? null,
      destinationUserId: goalToCreate.destinationUserId ?? null,
      destinationCharityId: goalToCreate.destinationCharityId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(Goal).values(values);

    const [created] = await db.select().from(Goal).where(eq(Goal.id, id));

    return c.json(created, 200);
  }
}
