import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupSummary } from "@commit/types";

describe("GET /api/groups (list)", () => {
  it("returns empty list initially", async () => {
    const res = await app.request("/api/groups", {}, env);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });

  it("lists groups after creating some", async () => {
    // Create goals first
    const goal1Res = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Goal A",
          description: "A test goal",
          startDate: new Date().toISOString(),
          dueStartTime: new Date().toISOString(),
          dueEndTime: new Date(Date.now() + 3600000).toISOString(),
          stakeCents: 1000,
          currency: "USD",
          destinationType: "charity",
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const goal1 = await goal1Res.json();

    const goal2Res = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Goal B",
          description: "Another test goal",
          startDate: new Date().toISOString(),
          dueStartTime: new Date().toISOString(),
          dueEndTime: new Date(Date.now() + 3600000).toISOString(),
          stakeCents: 1000,
          currency: "USD",
          destinationType: "charity",
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const goal2 = await goal2Res.json();

    const create = async (name: string, goalId: string) =>
      app.request(
        "/api/groups",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description: null,
            goalId,
          }),
          headers: new Headers({ "Content-Type": "application/json" }),
        },
        env
      );

    await create("A", goal1.id);
    await create("B", goal2.id);

    const res = await app.request("/api/groups", {}, env);
    expect(res.status).toBe(200);
    const items: GroupSummary[] = await res.json();
    expect(items.length).toBe(2);
    expect(items.map((g) => g.name).sort()).toEqual(["A", "B"]);
  });
});
