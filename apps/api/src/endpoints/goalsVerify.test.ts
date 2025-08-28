import app from "../index";
import { env } from "cloudflare:test";
import type { GoalCreateResponse } from "@commit/types";
import { describe, expect, it } from "vitest";
import { env as testEnv } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { v7 as uuid } from "uuid";

describe("POST /api/goals/:id/verify (verify)", () => {
  it("rejects verifying non-existing goal", async () => {
    const res = await app.request(
      "/api/goals/unknown/verify",
      {
        method: "POST",
        body: JSON.stringify([]),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(404);
  });

  it("logs verification entries", async () => {
    const create = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Read",
          description: null,
          stakeCents: 300,
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
    const goal: GoalCreateResponse = await create.json();

    const inputs = [
      {
        type: "photo",
        photoUrl: "https://example.com/p.jpg",
        photoDescription: "evidence",
        startTime: new Date().toISOString(),
      },
    ];

    const res = await app.request(
      `/api/goals/${goal.id}/verify`,
      {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const body: { message: string } = await res.json();
    expect(body.message).toBeDefined();
  });

  it("returns 400 on invalid verification payload", async () => {
    const create = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Read",
          description: null,
          stakeCents: 300,
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
    const goal: GoalCreateResponse = await create.json();

    const res = await app.request(
      `/api/goals/${goal.id}/verify`,
      {
        method: "POST",
        body: JSON.stringify({ not: "an array" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect([400, 422]).toContain(res.status);
  });

  it("returns 403 when verifying someone else's goal", async () => {
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
      name: "Private",
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
      `/api/goals/${goalId}/verify`,
      {
        method: "POST",
        body: JSON.stringify([]),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(403);
  });
});
