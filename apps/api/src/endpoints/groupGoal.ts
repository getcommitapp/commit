import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupGoalGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group, Goal, GoalVerificationsMethod, Session } from "../db/schema";

export class GroupGoal extends OpenAPIRoute {
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
    const auth = c.req.header("Authorization");
    const token = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : undefined;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const session = await db
      .select({ userId: Session.userId })
      .from(Session)
      .where(eq(Session.token, token))
      .get();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const url = new URL(c.req.url);
    const match = url.pathname.match(/\/groups\/([^/]+)/);
    const id = match?.[1];
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

    return {
      id: goal.id,
      ownerId: goal.ownerId,
      name: goal.name,
      description: goal.description ?? null,
      startDate: goal.startDate
        ? (goal.startDate as Date).toISOString().slice(0, 10)
        : null,
      endDate: goal.endDate ? (goal.endDate as Date).toISOString() : null,
      dueStartTime: goal.dueStartTime
        ? (goal.dueStartTime as Date).toISOString()
        : null,
      dueEndTime: goal.dueEndTime
        ? (goal.dueEndTime as Date).toISOString()
        : null,
      recurrence: goal.recurrence ?? null,
      stakeCents: goal.stakeCents ?? null,
      currency: goal.currency ?? null,
      destinationType: goal.destinationType ?? null,
      destinationUserId: goal.destinationUserId ?? null,
      destinationCharityId: goal.destinationCharityId ?? null,
      createdAt: (goal.createdAt as Date).toISOString(),
      updatedAt: (goal.updatedAt as Date).toISOString(),
      verificationMethods: methods.map((m) => ({
        id: m.id,
        method: m.method,
        latitude: m.latitude ?? null,
        longitude: m.longitude ?? null,
        radiusM: m.radiusM ?? null,
        durationSeconds: m.durationSeconds ?? null,
        graceTime: m.graceTime ? (m.graceTime as Date).toISOString() : null,
        createdAt: (m.createdAt as Date).toISOString(),
        updatedAt: (m.updatedAt as Date).toISOString(),
      })),
    };
  }
}
