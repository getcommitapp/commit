import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupGoalGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, Goal, GoalVerificationsMethod } from "../db/schema";

export class GroupsGoal extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Get the group's goal",
    responses: {
      "200": {
        description: "Returns the group's goal",
        content: {
          "application/json": {
            schema: GroupGoalGetResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB);
    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const g = await db
      .select({ goalId: Group.goalId })
      .from(Group)
      .where(eq(Group.id, id))
      .get();
    if (!g || !g.goalId) return new Response("Not Found", { status: 404 });

    const goal = await db
      .select()
      .from(Goal)
      .where(eq(Goal.id, g.goalId))
      .get();
    if (!goal) return new Response("Not Found", { status: 404 });

    const methods = await db
      .select()
      .from(GoalVerificationsMethod)
      .where(eq(GoalVerificationsMethod.goalId, g.goalId))
      .all();

    return c.json({
      id: goal.id,
      ownerId: goal.ownerId,
      name: goal.name,
      description: goal.description ?? null,
      startDate: goal.startDate,
      endDate: goal.endDate ?? null,
      dueStartTime: goal.dueStartTime,
      dueEndTime: goal.dueEndTime ?? null,
      recurrence: goal.recurrence ?? null,
      stakeCents: goal.stakeCents ?? null,
      currency: goal.currency ?? null,
      destinationType: goal.destinationType ?? null,
      destinationUserId: goal.destinationUserId ?? null,
      destinationCharityId: goal.destinationCharityId ?? null,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      verificationMethods: methods.map((m) => ({
        id: m.id,
        method: m.method,
        latitude: m.latitude ?? null,
        longitude: m.longitude ?? null,
        radiusM: m.radiusM ?? null,
        durationSeconds: m.durationSeconds ?? null,
        graceTime: m.graceTime ?? null,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
    });
  }
}
