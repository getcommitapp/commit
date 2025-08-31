import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupJoinResponse, GoalCreateResponse } from "@commit/types";

describe("POST /api/groups/join (join)", () => {
  it("successfully joins a group with valid invite code", async () => {
    // Create a goal first
    const goalRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test Goal",
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
    const goal = await goalRes.json<GoalCreateResponse>();

    // Create a group with user_2 as creator
    const groupId = crypto.randomUUID();
    const inviteCode = "INV123";
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    await testEnv.DB.exec(
      `INSERT INTO "group" (id, creatorId, goalId, name, inviteCode, updatedAt) VALUES ('${groupId}', 'user_2', '${goal.id}', 'Test Group', '${inviteCode}', strftime('%s','now'));`
    );

    // Join the group as user_1
    const res = await app.request(
      "/api/groups/join",
      {
        method: "POST",
        body: JSON.stringify({ code: inviteCode }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const json: GroupJoinResponse = await res.json();
    expect(json.id).toBe(groupId);
    expect(json.name).toBe("Test Group");
    expect(json.inviteCode).toBe(inviteCode);
  });

  it("returns 404 for invalid invite code", async () => {
    const res = await app.request(
      "/api/groups/join",
      {
        method: "POST",
        body: JSON.stringify({ code: "INVALID_CODE" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(404);
  });

  it("returns 409 when user is already a member", async () => {
    // Create a goal first
    const goalRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test Goal",
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
    const goal = await goalRes.json<GoalCreateResponse>();

    // Create a group with user_2 as creator
    const groupId = crypto.randomUUID();
    const inviteCode = "INV123";
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    await testEnv.DB.exec(
      `INSERT INTO "group" (id, creatorId, goalId, name, inviteCode, updatedAt) VALUES ('${groupId}', 'user_2', '${goal.id}', 'Test Group', '${inviteCode}', strftime('%s','now'));`
    );

    // Add user_1 as a participant
    await testEnv.DB.exec(
      `INSERT INTO group_member (groupId, userId, joinedAt, status, updatedAt) VALUES ('${groupId}', 'user_1', strftime('%s','now'), NULL, strftime('%s','now'));`
    );

    // Try to join again
    const res = await app.request(
      "/api/groups/join",
      {
        method: "POST",
        body: JSON.stringify({ code: inviteCode }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(409);
  });

  it("returns 400 for invalid request body", async () => {
    const res = await app.request(
      "/api/groups/join",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect([400, 422]).toContain(res.status);
  });

  it("returns 400 for missing code", async () => {
    const res = await app.request(
      "/api/groups/join",
      {
        method: "POST",
        body: JSON.stringify({ code: "" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect([400, 422]).toContain(res.status);
  });
});
