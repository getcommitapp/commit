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

  it("allows group members to check-in", async () => {
    // Create a goal owned by another user
    const db = drizzle(testEnv.DB);
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('group_creator','Creator','creator@example.com',1,NULL,strftime('%s','now'));`
    );
    
    const goalId = uuid();
    const now = new Date();
    await db.insert(schema.Goal).values({
      id: goalId,
      ownerId: "group_creator",
      name: "Group Goal",
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

    // Create a group with this goal
    const groupId = uuid();
    await db.insert(schema.Group).values({
      id: groupId,
      creatorId: "group_creator",
      goalId: goalId,
      name: "Test Group",
      description: null,
      inviteCode: "TEST123",
      createdAt: now,
      updatedAt: now,
    });

    // Add user_1 as a group member
    await db.insert(schema.GroupMember).values({
      groupId: groupId,
      userId: "user_1",
      joinedAt: now,
      status: null,
      createdAt: now,
      updatedAt: now,
    });

    // Now user_1 should be able to check-in on the group goal
    const res = await app.request(
      `/api/goals/${goalId}/checkin`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json<GoalActionResponse>();
    expect(body.state).toBeDefined();
  });
});
