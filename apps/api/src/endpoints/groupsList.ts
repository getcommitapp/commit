import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GroupsListResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, exists, or } from "drizzle-orm";
import * as schema from "../db/schema";

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
    const userId = c.var.user.id;

    const groups = await db.query.Group.findMany({
      with: {
        goal: {
          with: {
            verificationMethods: true,
          },
        },
        participants: true,
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

    const response = groups.map((g) => ({
      ...g,
      memberCount: g.participants.length ?? 0,
    }));

    return c.json(response);
  }
}
