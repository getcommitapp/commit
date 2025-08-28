import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GoalGetResponse } from "@commit/types";

describe("GET /api/goals (list)", () => {
  it("returns empty list initially", async () => {
    const res = await app.request("/api/goals", {}, env);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });

  it("lists goals after creating some", async () => {
    const create = async (name: string) =>
      app.request(
        "/api/goals",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description: null,
            stakeCents: 100,
            currency: "CHF",
            recurrence: null,
            startDate: new Date().toISOString(),
            endDate: null,
            dueStartTime: new Date().toISOString(),
            dueEndTime: null,
            destinationType: "user",
            destinationUserId: null,
            destinationCharityId: null,
          }),
          headers: new Headers({ "Content-Type": "application/json" }),
        },
        env
      );

    await create("A");
    await create("B");

    const res = await app.request("/api/goals", {}, env);
    expect(res.status).toBe(200);
    const items: GoalGetResponse[] = await res.json();
    expect(items.length).toBe(2);
    expect(items.map((g: GoalGetResponse) => g.name).sort()).toEqual([
      "A",
      "B",
    ]);
  });
});
