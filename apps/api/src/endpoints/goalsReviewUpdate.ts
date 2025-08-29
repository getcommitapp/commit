import { contentJson, OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import { GoalReviewUpdateRequestSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class GoalsReviewUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Update a Goal validation log",
    parameters: [
      {
        name: "id",
        in: "path" as const,
        required: true,
        schema: {
          type: "string" as const,
        },
        description: "Goal ID",
      },
    ],
    request: {
      body: contentJson(GoalReviewUpdateRequestSchema),
    },
    responses: {
      "404": {
        description: "Verification log not found",
      },
      "403": {
        description: "Unauthorized - reviewer access required",
      },
    },
  };

  async handle(c: AppContext) {
    const goalId = c.req.param("id");

    const user = c.var.user;

    const data = await this.getValidatedData<typeof this.schema>();
    const { approvalStatus } = data.body;

    const db = drizzle(c.env.DB, { schema });
    const now = new Date();

    if (user.role !== "reviewer" && user.role !== "admin") {
      return c.json({ error: "Unauthorized - reviewer access required" }, 403);
    }

    const updated = await db
      .update(schema.GoalVerificationsLog)
      .set({
        approvalStatus: approvalStatus,
        verifiedAt: now,
        updatedAt: now,
        approvedBy: user.id,
      })
      .where(eq(schema.GoalVerificationsLog.goalId, goalId))
      .returning();

    return c.json(updated[0]);
  }
}
