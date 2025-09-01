import { app } from "../index";
import { env } from "cloudflare:test";
import type { GoalBase } from "@commit/types";
import { describe, expect, it } from "vitest";

describe("GET /api/goals/:id (fetch)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request("/api/goals/does-not-exist", {}, env);
    expect(res.status).toBe(404);
  });

  it("fetches an existing goal with computed state", async () => {
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Daily pushups",
          description: null,
          stakeCents: 100,
          currency: "CHF",
          startDate: new Date().toISOString(),
          endDate: null,
          dueStartTime: new Date().toISOString(),
          dueEndTime: null,
          method: "checkin",
          graceTimeSeconds: 60,
          destinationType: "charity",
          destinationUserId: null,
          destinationCharityId: null,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const created = (await createRes.json()) as GoalBase;

    const res = await app.request(`/api/goals/${created.id}`, {}, env);
    expect(res.status).toBe(200);
    const body = (await res.json()) as GoalBase & {
      state: string;
      occurrence?: {
        start: string;
        end?: string | null;
        latestStart?: string | null;
        graceUntil?: string | null;
      } | null;
      actions?: Array<{
        kind: string;
        presentation: string;
        visibleFrom: string;
        visibleUntil?: string | null;
        enabled: boolean;
        label?: string;
      }>;
      nextTransitionAt?: string | null;
    };
    expect(body.id).toBe(created.id);
    expect(body.name).toBe("Daily pushups");
    expect(body.state).toBeTruthy();
    expect(body.actions).toBeDefined();
  });
});
