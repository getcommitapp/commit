import app from "../index";
import { env } from "cloudflare:test";
import type { GoalCreateResponse, GoalGetResponse } from "@commit/types";
import { describe, expect, it } from "vitest";
import { env as testEnv } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";

describe("GET /api/goals/:id (fetch)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request("/api/goals/does-not-exist", {}, env);
    expect(res.status).toBe(404);
  });

  it("fetches an existing goal with verification methods", async () => {
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Study",
          description: null,
          stakeCents: 1000,
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
    const goal: GoalCreateResponse = await createRes.json();

    const res = await app.request(`/api/goals/${goal.id}`, {}, env);
    expect(res.status).toBe(200);
    const full: GoalGetResponse = await res.json();
    expect(full.id).toBe(goal.id);
    expect(Array.isArray(full.verificationMethods)).toBe(true);
  });

  it("returns 403 when fetching someone else's goal", async () => {
    const db = drizzle(testEnv.DB);

    // Insert another user and their goal
    const otherUserId = "user_2";
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updated_at) VALUES ('${otherUserId}','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    const goalId = uuid();
    const now = new Date();
    await db.insert(schema.Goal).values({
      id: goalId,
      ownerId: otherUserId,
      name: "Private",
      description: null,
      startDate: now,
      endDate: null,
      dueStartTime: now,
      dueEndTime: null,
      recurrence: null,
      stakeCents: 100,
      currency: "USD",
      destinationType: "user",
      destinationUserId: null,
      destinationCharityId: null,
      createdAt: now,
      updatedAt: now,
    });

    const res = await app.request(`/api/goals/${goalId}`, {}, env);
    expect(res.status).toBe(403);
  });
});
