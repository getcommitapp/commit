import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalsListResponseSchema } from "@commit/types";
import { evaluateGoalState } from "../services/goalStateService";
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
      with: { verificationMethods: true, group: true, verificationsLog: true },
      where: eq(schema.Goal.ownerId, user.id),
    });

    const results = await Promise.all(
      rows.map(async (g) => {
        const firstMethod = g.verificationMethods?.[0] ?? null;
        delete g.verificationMethods;
        const base = {
          ...g,
          verificationMethod: firstMethod,
          groupId: g.group?.id ?? null,
        };
        const todayLocal = new Intl.DateTimeFormat("en-CA", {
          timeZone: user.timezone || "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(new Date())
          .replace(/\//g, "-");
        const todayLog = g.verificationsLog?.find(
          (v) => v.userId === user.id && v.occurrenceDate === todayLocal
        );
        const occurrenceVerification = todayLog
          ? ({ status: todayLog.approvalStatus } as const)
          : null;
        const status = evaluateGoalState(
          { ...g, verificationMethod: firstMethod },
          user,
          occurrenceVerification
        );
        return {
          ...base,
          state: status.state,
          engineFlags: status.engine.flags ?? undefined,
          timeLeft: status.engine.labels?.timeLeft ?? undefined,
        };
      })
    );

    return c.json(results, 200);
  }
}
