import app from "../index";
import { env } from "cloudflare:test";
import type { GoalCreateResponse, GoalDeleteResponse } from "@commit/types";
import { describe, expect, it } from "vitest";
import { env as testEnv } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";

describe("DELETE /api/goals/:id (delete)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request("/api/goals/nope", { method: "DELETE" }, env);
    expect(res.status).toBe(404);
  });

  it("deletes an existing goal", async () => {
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Meditate",
          description: null,
          stakeCents: 200,
          currency: "EUR",
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

    const del = await app.request(
      `/api/goals/${goal.id}`,
      { method: "DELETE" },
      env
    );
    expect(del.status).toBe(200);
    const body: GoalDeleteResponse = await del.json();
    expect(body.message).toBeDefined();

    const check = await app.request(`/api/goals/${goal.id}`, {}, env);
    expect(check.status).toBe(404);
  });

  it("returns 403 when deleting someone else's goal", async () => {
    const db = drizzle(testEnv.DB);
    const otherUserId = "user_2";
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('${otherUserId}','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    const goalId = uuid();
    const now = new Date();
    await db.insert(schema.Goal).values({
      id: goalId,
      ownerId: otherUserId,
      name: "Not yours",
      description: null,
      startDate: now,
      endDate: null,
      dueStartTime: now,
      dueEndTime: null,
      recurrence: null,
      stakeCents: 100,
      currency: "CHF",
      destinationType: "user",
      destinationUserId: null,
      destinationCharityId: null,
      createdAt: now,
      updatedAt: now,
    });

    const res = await app.request(
      `/api/goals/${goalId}`,
      { method: "DELETE" },
      env
    );
    expect(res.status).toBe(403);
  });
});
