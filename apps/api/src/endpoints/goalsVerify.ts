import { OpenAPIRoute, contentJson } from "chanfana";
import type { AppContext } from "../types";
import {
  GoalVerifyRequestSchema,
  GoalVerifyResponseSchema,
} from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { v7 as uuid } from "uuid";

export class GoalsVerify extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Verify the completion of the goal",
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
      body: contentJson(GoalVerifyRequestSchema),
    },
    responses: {
      "200": {
        description: "Verification log submitted.",
        content: {
          "application/json": {
            schema: GoalVerifyResponseSchema,
          },
        },
      },
      "404": {
        description: "Goal not found",
      },
      "403": {
        description: "Unauthorized to verify this goal",
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const goalId = c.req.param("id");
    const verificationInputs = data.body;

    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    // Check if goal exists and user owns it
    const [goal] = await db
      .select()
      .from(schema.Goal)
      .where(eq(schema.Goal.id, goalId))
      .limit(1);

    if (!goal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    if (goal.ownerId !== user.id) {
      return c.json({ error: "Unauthorized to verify this goal" }, 403);
    }

    // Create verification log entries
    const now = new Date();
    // Load goal's first verification method
    const dbWithSchema = drizzle(c.env.DB, { schema });
    const goalWithMethod = await dbWithSchema.query.Goal.findFirst({
      where: eq(schema.Goal.id, goalId),
      with: { verificationMethods: true },
    });
    const firstMethod = goalWithMethod?.verificationMethods?.[0] ?? null;
    const isPhoto = (firstMethod?.method ?? null) === "photo";
    for (const verification of verificationInputs) {
      await db.insert(schema.GoalVerificationsLog).values({
        id: uuid(),
        goalId: goalId,
        userId: user.id,
        occurrenceDate: verification.occurrenceDate ?? null,
        verifiedAt: null,
        approvalStatus: isPhoto ? "pending" : "approved",
        approvedBy: null,
        startTime: verification.startTime
          ? new Date(verification.startTime)
          : null,
        photoDescription: verification.photoDescription ?? null,
        photoUrl: verification.photoUrl ?? null,
        createdAt: now,
        updatedAt: now,
      });
    }

    // TODO: if this goal is recurrent and verification implies completion or failure,
    // reset the per-user timer for this goal: set goal_timer.startedAt = NULL for (goalId,userId).

    return c.json({ message: "Verification log submitted." }, 200);
  }
}
