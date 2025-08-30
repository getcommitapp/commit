import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, exists, isNotNull } from "drizzle-orm";

export class GoalsList extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "List Goals",
    responses: {
      "200": {
        description: "Returns a list of goals",
        content: {
          "application/json": {
            schema: GoalsListResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const db = drizzle(c.env.DB, { schema });

    // Single query using correlated exists for hasDurationVerification and left-join group for group info
    const rows = await db
      .select({
        id: schema.Goal.id,
        ownerId: schema.Goal.ownerId,
        name: schema.Goal.name,
        description: schema.Goal.description,
        startDate: schema.Goal.startDate,
        endDate: schema.Goal.endDate,
        dueStartTime: schema.Goal.dueStartTime,
        dueEndTime: schema.Goal.dueEndTime,
        recurrence: schema.Goal.recurrence,
        stakeCents: schema.Goal.stakeCents,
        currency: schema.Goal.currency,
        destinationType: schema.Goal.destinationType,
        destinationUserId: schema.Goal.destinationUserId,
        destinationCharityId: schema.Goal.destinationCharityId,
        createdAt: schema.Goal.createdAt,
        updatedAt: schema.Goal.updatedAt,
        hasDurationVerification: exists(
          db
            .select({ one: schema.GoalVerificationsMethod.id })
            .from(schema.GoalVerificationsMethod)
            .where(
              and(
                eq(schema.GoalVerificationsMethod.goalId, schema.Goal.id),
                isNotNull(schema.GoalVerificationsMethod.durationSeconds)
              )
            )
        ),
        groupId: schema.Group.id,
        groupName: schema.Group.name,
        groupDescription: schema.Group.description,
      })
      .from(schema.Goal)
      .leftJoin(schema.Group, eq(schema.Group.goalId, schema.Goal.id))
      .where(eq(schema.Goal.ownerId, user.id));

    const response = rows.map((r) => ({
      ...r,
      hasDurationVerification: Boolean(r.hasDurationVerification),
      group: r.groupId
        ? {
            id: r.groupId,
            name: r.groupName!,
            description: r.groupDescription ?? undefined,
          }
        : null,
    }));

    return c.json(response, 200);
  }
}
