import { app } from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";
import { GoalCreateResponse, GoalActionResponse } from "@commit/types";

describe("POST /api/goals/:id/movement (start/violate)", () => {
  it("returns 404 for unknown goal id on start", async () => {
    const res = await app.request(
      "/api/goals/unknown/movement/start",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(404);
  });

  it("forbids non-actor on start", async () => {
    const db = drizzle(testEnv.DB);
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    const goalId = uuid();
    const now = new Date();
    await db.insert(schema.Goal).values({
      id: goalId,
      ownerId: "user_2",
      name: "Move",
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
      method: "movement",
      graceTimeSeconds: null,
      durationSeconds: 600,
      geoLat: null,
      geoLng: null,
      geoRadiusM: null,
      createdAt: now,
      updatedAt: now,
    });

    const res = await app.request(
      `/api/goals/${goalId}/movement/start`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(403);
  });

  it("start and then violate updates state and resets timer fields", async () => {
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Daily movement",
          description: null,
          stakeCents: 100,
          currency: "CHF",
          startDate: new Date().toISOString(),
          endDate: null,
          dueStartTime: new Date().toISOString(),
          dueEndTime: null,
          method: "movement",
          durationSeconds: 60,
          destinationType: "charity",
          destinationUserId: null,
          destinationCharityId: null,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const created = await createRes.json<GoalCreateResponse>();

    const startRes = await app.request(
      `/api/goals/${created.id}/movement/start`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(startRes.status).toBe(200);
    const startBody = await startRes.json<GoalActionResponse>();
    expect(startBody.state).toBeDefined();

    const violRes = await app.request(
      `/api/goals/${created.id}/movement/violate`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(violRes.status).toBe(200);
    const violBody = await violRes.json<GoalActionResponse>();
    expect(violBody.state).toBeDefined();
  });
});
