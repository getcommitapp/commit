import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import { evaluateGoalStatus } from "../services/goalStatusService";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

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
      with: { verificationMethods: true, group: true },
      where: eq(schema.Goal.ownerId, user.id),
    });

    const response = rows.map((g) => {
      const firstMethod = g.verificationMethods?.[0] ?? null;
      delete g.verificationMethods;
      const base = {
        ...g,
        verificationMethod: firstMethod,
        groupId: g.group?.id ?? null,
      };
      const status = evaluateGoalStatus(g, user);
      return { ...base, status: status.status };
    });

    return c.json(response, 200);
  }
}
