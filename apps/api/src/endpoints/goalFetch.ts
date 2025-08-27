import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalGetResponseSchema } from "@commit/types";
import { Goal, GoalVerificationsMethod } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

export class GoalFetch extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Get a single Goal by id",
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
    responses: {
      "200": {
        description: "Returns a single goal if found",
        content: {
          "application/json": {
            schema: GoalGetResponseSchema,
          },
        },
      },
      "404": {
        description: "Goal not found",
      },
      "403": {
        description: "Unauthorized to access this goal",
      },
    },
  };

  async handle(c: AppContext) {
    const goalId = c.req.param("id");

    const user = c.var.user!;
    const db = drizzle(c.env.DB);

    // Get goal with verification methods
    const [goal] = await db
      .select()
      .from(Goal)
      .where(eq(Goal.id, goalId))
      .limit(1);

    if (!goal) {
      return c.json({ error: "Goal not found" }, 404);
    }

    if (goal.ownerId !== user.id) {
      return c.json({ error: "Unauthorized to access this goal" }, 403);
    }

    // Get verification methods
    const verificationMethods = await db
      .select()
      .from(GoalVerificationsMethod)
      .where(eq(GoalVerificationsMethod.goalId, goalId));

    const response = {
      ...goal,
      startDate: goal.startDate?.toISOString(),
      endDate: goal.endDate?.toISOString() ?? null,
      dueStartTime: goal.dueStartTime?.toISOString(),
      dueEndTime: goal.dueEndTime?.toISOString() ?? null,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
      verificationMethods: verificationMethods.map((vm) => ({
        ...vm,
        graceTime: vm.graceTime?.toISOString() ?? null,
        createdAt: vm.createdAt.toISOString(),
        updatedAt: vm.updatedAt.toISOString(),
      })),
    };

    return c.json(response, 200);
  }
}
