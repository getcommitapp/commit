import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalReviewListResponseSchema } from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, asc, eq, ne, sql } from "drizzle-orm";

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
        goalId: schema.GoalOccurrence.goalId,
        userId: schema.GoalOccurrence.userId,
        occurrenceDate: schema.GoalOccurrence.occurrenceDate,
        goalName: schema.Goal.name,
        goalDescription: schema.Goal.description,
        photoUrl: schema.GoalOccurrence.photoUrl,
      })
      .from(schema.GoalOccurrence)
      .innerJoin(schema.Goal, eq(schema.GoalOccurrence.goalId, schema.Goal.id))
      .where(
        and(
          eq(schema.GoalOccurrence.status, "pending"),
          sql`${schema.GoalOccurrence.photoUrl} IS NOT NULL`,
          eq(schema.Goal.method, "photo"),
          ne(schema.GoalOccurrence.userId, user.id)
        )
      )
      .orderBy(asc(schema.GoalOccurrence.occurrenceDate));

    // Resolve relative URLs to absolute using request origin
    const origin = new URL(c.req.url).origin;
    const withAbsoluteUrls = verificationLogs.map((row) => ({
      ...row,
      photoUrl:
        row.photoUrl && row.photoUrl.startsWith("/")
          ? `${origin}${row.photoUrl}`
          : row.photoUrl,
    }));

    return c.json(withAbsoluteUrls, 200);
  }
}
