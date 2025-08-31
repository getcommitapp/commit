import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { todayLocal, computeState } from "../services/goalService";

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

    const rows = await db.query.Goal.findMany({
      where: eq(schema.Goal.ownerId, user.id),
    });

    const localDate = todayLocal(user.timezone);

    // Load today's occurrences for this user
    const occs = await db.query.GoalOccurrence.findMany({
      where: and(
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, localDate)
      ),
    });
    const occIndex = new Map(occs.map((o) => [o.goalId, o]));

    const results = rows.map((g) => {
      const occ = occIndex.get(g.id) || null;
      const cs = computeState(g, user, occ);
      return {
        ...g,
        state: cs.state,
        engineFlags: cs.engineFlags,
        timeLeft: cs.timeLeft,
        groupId: null,
      };
    });

    return c.json(results, 200);
  }
}
