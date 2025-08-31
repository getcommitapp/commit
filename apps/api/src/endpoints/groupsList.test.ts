import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupsListResponse } from "@commit/types";

describe("GET /api/groups (list)", () => {
  it("returns empty list initially", async () => {
    const res = await app.request("/api/groups", {}, env);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });

  it("lists groups after creating some", async () => {
    const create = async (name: string, goalName: string) =>
      app.request(
        "/api/groups",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description: null,
            goal: {
              name: goalName,
              description: "A test goal",
              startDate: new Date().toISOString(),
              dueStartTime: new Date().toISOString(),
              dueEndTime: new Date(Date.now() + 3600000).toISOString(),
              stakeCents: 1000,
              currency: "USD",
              destinationType: "charity",
              method: "checkin",
              graceTimeSeconds: 60,
            },
          }),
          headers: new Headers({ "Content-Type": "application/json" }),
        },
        env
      );

    await create("A", "Goal A");
    await create("B", "Goal B");

    const res = await app.request("/api/groups", {}, env);
    expect(res.status).toBe(200);
    const items = (await res.json()) as GroupsListResponse;
    expect(items.length).toBe(2);
    expect(items.map((g) => g.name).sort()).toEqual(["A", "B"]);
  });
});
