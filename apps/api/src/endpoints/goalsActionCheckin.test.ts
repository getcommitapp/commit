import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";
import { GoalCreateResponse, GoalActionResponse } from "@commit/types";

describe("POST /api/goals/:id/checkin (action)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request(
      "/api/goals/unknown/checkin",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(404);
  });

  it("rejects unauthorized owner with 403", async () => {
    // Create a goal owned by another user directly in DB
    const db = drizzle(testEnv.DB);
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    const goalId = uuid();
    const now = new Date();
    await db.insert(schema.Goal).values({
      id: goalId,
      ownerId: "user_2",
      name: "Not yours",
      description: null,
      startDate: now,
      endDate: null,
      dueStartTime: now,
      dueEndTime: null,
      localDueStart: null,
      localDueEnd: null,
      recDaysMask: null,
      stakeCents: 100,
      currency: "CHF",
      destinationType: "user",
      destinationUserId: null,
      destinationCharityId: null,
      method: "checkin",
      graceTimeSeconds: 60,
      durationSeconds: null,
      geoLat: null,
      geoLng: null,
      geoRadiusM: null,
      createdAt: now,
      updatedAt: now,
    });

    const res = await app.request(
      `/api/goals/${goalId}/checkin`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(403);
  });

  it("creates or updates today's occurrence and returns state", async () => {
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Daily checkin",
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
    const created = await createRes.json<GoalCreateResponse>();

    const res1 = await app.request(
      `/api/goals/${created.id}/checkin`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res1.status).toBe(200);
    const body1 = await res1.json<GoalActionResponse>();
    expect(body1.state).toBeDefined();

    // Repeat checkin to ensure update path works
    const res2 = await app.request(
      `/api/goals/${created.id}/checkin`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res2.status).toBe(200);
    const body2 = await res2.json<GoalActionResponse>();
    expect(body2.state).toBeDefined();
  });
});
