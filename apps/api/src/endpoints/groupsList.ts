import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, exists, or } from "drizzle-orm";
import * as schema from "../db/schema";
import { evaluateGoalState } from "../services/goalStateService";

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
        goal: {
          with: { verificationsLog: true, verificationMethods: true },
        },
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

    const response = await Promise.all(
      groups.map(async (g) => {
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
          : [
              ...baseMembers,
              { name: selfName, isOwner: g.creatorId === userId },
            ];

        const tz = c.var.user?.timezone || "UTC";
        const todayLocal = new Intl.DateTimeFormat("en-CA", {
          timeZone: tz,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(new Date())
          .replace(/\//g, "-");
        const todayLog = g.goal.verificationsLog?.find(
          (v) => v.userId === userId && v.occurrenceDate === todayLocal
        );
        const occurrenceVerification = todayLog
          ? ({ status: todayLog.approvalStatus } as const)
          : null;
        const firstMethod = g.goal.verificationMethods?.[0] ?? null;
        const status = evaluateGoalState(
          { ...g.goal, verificationMethod: firstMethod },
          c.var.user!,
          occurrenceVerification
        );
        return {
          ...g,
          memberCount: g.participants.length ?? 0,
          isOwner: g.creatorId === userId,
          members,
          goal: {
            ...g.goal,
            state: status.state,
            engineFlags: status.engine.flags ?? undefined,
            timeLeft: status.engine.labels?.timeLeft ?? undefined,
          },
        };
      })
    );

    return c.json(response);
  }
}
