import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import {
  GoalVerifyRequestSchema,
  GoalVerifyResponseSchema,
} from "@commit/types";
import { Goal, GoalVerificationsLog } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { v7 as uuid } from "uuid";

export class GoalVerify extends OpenAPIRoute {
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
      body: {
        content: {
          "application/json": {
            schema: GoalVerifyRequestSchema,
          },
        },
      },
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
      .from(Goal)
      .where(eq(Goal.id, goalId))
      .limit(1);

    if (!goal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    if (goal.ownerId !== user.id) {
      return c.json({ error: "Unauthorized to verify this goal" }, 403);
    }

    // Create verification log entries
    const now = new Date();
    for (const verification of verificationInputs) {
      await db.insert(GoalVerificationsLog).values({
        id: uuid(),
        goalId: goalId,
        userId: user.id,
        type: verification.type,
        verifiedAt: null,
        approvalStatus: "pending",
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

    return c.json({ message: "Verification log submitted." }, 200);
  }
}
