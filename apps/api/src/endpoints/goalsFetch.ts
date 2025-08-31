import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { GoalBaseSchema } from "@commit/types";
import { todayLocal, computeState } from "../services/goalService";

export class GoalsFetch extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Fetch a specific goal by ID",
    responses: {
      "200": {
        description: "Returns the goal",
        content: {
          "application/json": {
            schema: GoalBaseSchema,
          },
        },
      },
      "404": { description: "Goal not found" },
    },
  };

  async handle(c: AppContext) {
    const db = drizzle(c.env.DB, { schema });
    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const goal = await db.query.Goal.findFirst({
      where: eq(schema.Goal.id, id),
    });
    if (!goal) return new Response("Not Found", { status: 404 });

    const user = c.var.user!;
    const localDate = todayLocal(user.timezone);
    const occ = await db.query.GoalOccurrence.findFirst({
      where: and(
        eq(schema.GoalOccurrence.goalId, id),
        eq(schema.GoalOccurrence.userId, user.id),
        eq(schema.GoalOccurrence.occurrenceDate, localDate)
      ),
    });

    const cs = computeState(goal, user, occ);
    return c.json({
      ...goal,
      state: cs.state,
      engineFlags: cs.engineFlags,
      timeLeft: cs.timeLeft,
    });
  }
}
