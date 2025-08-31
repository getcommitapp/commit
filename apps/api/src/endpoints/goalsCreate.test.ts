import app from "../index";
import { env } from "cloudflare:test";
import type { GoalCreateResponse } from "@commit/types";
import { describe, expect, it } from "vitest";

describe("POST /api/goals (create)", () => {
  it("creates a goal and returns it", async () => {
    const body = {
      name: "Run daily",
      description: "Run 5km",
      stakeCents: 5000,
      currency: "CHF",
      // flattened schedule; keep single window
      startDate: new Date().toISOString(),
      endDate: null,
      dueStartTime: new Date().toISOString(),
      dueEndTime: null,
      method: "checkin",
      graceTimeSeconds: 60,
      destinationType: "charity",
      destinationUserId: null,
      destinationCharityId: null,
    };

    const res = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const created: GoalCreateResponse = await res.json();
    expect(created.id).toBeTruthy();
    expect(created.name).toBe(body.name);
    expect(created.ownerId).toBe("user_1");
  });

  it("rejects invalid payload with 400", async () => {
    const res = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect([400, 422]).toContain(res.status);
  });
});
