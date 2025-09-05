import { app } from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";
import { GoalCreateResponse, GoalActionResponse } from "@commit/types";

describe("POST /api/goals/:id/photo (action)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request(
      "/api/goals/unknown/photo",
      {
        method: "POST",
        body: JSON.stringify({ photoUrl: "https://x/y.jpg" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(404);
  });

  it("rejects when not owner nor group member", async () => {
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
      method: "photo",
      graceTimeSeconds: 60,
      durationSeconds: null,
      geoLat: null,
      geoLng: null,
      geoRadiusM: null,
      createdAt: now,
      updatedAt: now,
    });

    const res = await app.request(
      `/api/goals/${goalId}/photo`,
      {
        method: "POST",
        body: JSON.stringify({ photoUrl: "https://x/y.jpg" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(403);
  });

  it("upserts occurrence and returns state for owner", async () => {
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Daily photo",
          description: null,
          stakeCents: 100,
          currency: "CHF",
          startDate: new Date().toISOString(),
          endDate: null,
          dueStartTime: new Date().toISOString(),
          dueEndTime: null,
          method: "photo",
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

    const res = await app.request(
      `/api/goals/${created.id}/photo`,
      {
        method: "POST",
        body: JSON.stringify({ photoUrl: "https://example.com/p.jpg" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const json = await res.json<GoalActionResponse>();
    expect(json.state).toBeDefined();
  });
});
