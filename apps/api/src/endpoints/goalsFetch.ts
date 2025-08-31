import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { GoalBaseSchema } from "@commit/types";
import { evaluateGoalState } from "../services/goalStateService";

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
      with: { verificationMethods: true },
    });
    if (!goal) return new Response("Not Found", { status: 404 });

    const user = c.var.user!;
    const firstMethod = goal.verificationMethods?.[0] ?? null;
    const status = evaluateGoalState(
      { ...goal, verificationMethod: firstMethod },
      user,
      null
    );
    const { verificationMethods, ...rest } = goal;
    return c.json({
      ...rest,
      verificationMethod: firstMethod,
      state: status.state,
      engineFlags: status.engine.flags ?? undefined,
      timeLeft: status.engine.labels?.timeLeft ?? undefined,
    });
  }
}
