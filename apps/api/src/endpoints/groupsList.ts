import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, exists, or } from "drizzle-orm";
import * as schema from "../db/schema";
import { evaluateGoalStatus } from "../services/goalStatusService";

export class GroupsList extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "List groups",
    responses: {
      "200": {
        description: "Returns a list of groups",
        content: {
          "application/json": {
            schema: GroupsListResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB, { schema });
    const userId = c.var.user!.id;

    const groups = await db.query.Group.findMany({
      with: {
        goal: true,
        creator: true,
        participants: {
          with: {
            user: true,
          },
        },
      },
      where: or(
        eq(schema.Group.creatorId, userId),
        exists(
          db
            .select({ one: schema.GroupParticipants.userId })
            .from(schema.GroupParticipants)
            .where(
              and(
                eq(schema.GroupParticipants.groupId, schema.Group.id),
                eq(schema.GroupParticipants.userId, userId)
              )
            )
        )
      ),
    });

    const response = groups.map((g) => {
      const baseMembers = [
        { name: g.creator?.name || "Unknown", isOwner: true },
        ...g.participants
          .filter((p) => p.userId !== g.creatorId)
          .map((p) => ({ name: p.user?.name || "Unknown", isOwner: false })),
      ];

      const selfName = c.var.user.name;
      const hasSelf = baseMembers.some((m) => m.name === selfName);
      const members = hasSelf
        ? baseMembers
        : [...baseMembers, { name: selfName, isOwner: g.creatorId === userId }];

      const status = evaluateGoalStatus(g.goal, c.var.user!);
      return {
        ...g,
        memberCount: g.participants.length ?? 0,
        isOwner: g.creatorId === userId,
        members,
        goal: {
          ...g.goal,
          status: status.status,
          engineFlags: status.engine.flags ?? undefined,
          timeLeft: status.engine.labels?.timeLeft ?? undefined,
        },
      };
    });

    return c.json(response);
  }
}
