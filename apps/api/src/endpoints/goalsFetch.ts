import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { Goal } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { GoalBaseSchema } from "@commit/types";
import { evaluateGoalStatus } from "../services/goalStatusService";

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
    const db = drizzle(c.env.DB);
    const { id } = c.req.param();
    if (!id) return new Response("Bad Request", { status: 400 });

    const goal = await db.select().from(Goal).where(eq(Goal.id, id)).get();
    if (!goal) return new Response("Not Found", { status: 404 });

    const user = c.var.user!;
    const status = evaluateGoalStatus(goal, user);
    return c.json({ ...goal, status: status.status });
  }
}
