import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import { GoalReviewUpdateRequestSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";

export class GoalsReviewUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Update a Goal validation log",
    request: {
      body: contentJson(GoalReviewUpdateRequestSchema),
    },
    responses: {
      "200": {
        description: "Goal validation log updated",
        content: {
          "application/json": {
            schema: GoalReviewUpdateRequestSchema,
          },
        },
      },
      "404": {
        description: "Goal occurrence not found",
      },
      "403": {
        description: "Unauthorized - reviewer access required",
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;

    const data = await this.getValidatedData<typeof this.schema>();
    const { goalId, userId, occurrenceDate, approvalStatus } = data.body;

    const db = drizzle(c.env.DB, { schema });
    const now = new Date();

    if (user.role !== "reviewer" && user.role !== "admin") {
      return c.json({ error: "Unauthorized - reviewer access required" }, 403);
    }

    const updated = await db
      .update(schema.GoalOccurrence)
      .set({
        status: approvalStatus,
        verifiedAt: now,
        updatedAt: now,
        approvedBy: user.id,
      })
      .where(
        and(
          eq(schema.GoalOccurrence.goalId, goalId),
          eq(schema.GoalOccurrence.userId, userId),
          eq(schema.GoalOccurrence.occurrenceDate, occurrenceDate)
        )
      )
      .returning();

    if (updated.length === 0) {
      return c.json({ error: "Goal occurrence not found" }, 404);
    }

    return c.json(updated[0]);
  }
}
