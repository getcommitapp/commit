import app from "../index";
import { env } from "cloudflare:test";
import type { GroupCreateResponse } from "@commit/types";
import { describe, expect, it } from "vitest";

describe("POST /api/groups (create)", () => {
  it("creates a group and returns it", async () => {
    const goal = {
      name: "Test Goal",
      description: "A test goal",
      startDate: new Date().toISOString(),
      dueStartTime: new Date().toISOString(),
      dueEndTime: new Date(Date.now() + 3600000).toISOString(),
      stakeCents: 1000,
      currency: "USD",
      destinationType: "charity",
      method: "checkin",
      graceTimeSeconds: 60,
    };

    const body = {
      name: "Runners",
      description: "People who like to run",
      goal,
    };

    const res = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const created: GroupCreateResponse = await res.json();
    expect(created.id).toBeTruthy();
    expect(created.name).toBe(body.name);
    expect(created.inviteCode).toBeTruthy();
  });

  it("rejects invalid payload with 400", async () => {
    const res = await app.request(
      "/api/groups",
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
