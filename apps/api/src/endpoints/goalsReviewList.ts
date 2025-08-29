import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalReviewListResponseSchema } from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";

export class GoalsReviewList extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Get all verification logs that need review",
    responses: {
      "200": {
        description: "Returns list of verification logs for review",
        content: {
          "application/json": {
            schema: GoalReviewListResponseSchema,
          },
        },
      },
      "403": {
        description: "Unauthorized - reviewer access required",
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    if (user.role !== "reviewer" && user.role !== "admin") {
      return c.json({ error: "Unauthorized - reviewer access required" }, 403);
    }

    const verificationLogs = await db
      .select({
        goalId: schema.GoalVerificationsLog.goalId,
        goalName: schema.Goal.name,
        photoUrl: schema.GoalVerificationsLog.photoUrl,
        photoDescription: schema.GoalVerificationsLog.photoDescription,
      })
      .from(schema.GoalVerificationsLog)
      .innerJoin(
        schema.Goal,
        eq(schema.GoalVerificationsLog.goalId, schema.Goal.id)
      )
      .where(
        and(
          eq(schema.GoalVerificationsLog.approvalStatus, "pending"),
          eq(schema.GoalVerificationsLog.type, "photo")
        )
      );

    return c.json(verificationLogs, 200);
  }
}
