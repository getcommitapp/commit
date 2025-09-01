import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GoalsListResponse, GoalCreateResponse } from "@commit/types";

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
            startDate: new Date().toISOString(),
            endDate: null,
            dueStartTime: new Date().toISOString(),
            dueEndTime: null,
            method: "checkin",
            graceTimeSeconds: 60,
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
    const items = (await res.json()) as GoalsListResponse;
    expect(items.length).toBe(2);
    expect(items.map((g) => g.name).sort()).toEqual(["A", "B"]);
  });

  it("includes group goals when user is a member", async () => {
    // Create a goal first for the group
    const goalRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Group Goal",
          description: "A goal for the group",
          stakeCents: 500,
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
    const goal = await goalRes.json<GoalCreateResponse>();

    // Create another user to be the group creator
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('creator_user','Creator','creator@example.com',1,NULL,strftime('%s','now'));`
    );

    // Create a group with the goal
    const groupId = crypto.randomUUID();
    const inviteCode = "TEST123";
    await testEnv.DB.exec(
      `INSERT INTO "group" (id, creatorId, goalId, name, inviteCode, updatedAt) VALUES ('${groupId}', 'creator_user', '${goal.id}', 'Test Group', '${inviteCode}', strftime('%s','now'));`
    );

    // Add user_1 as a group member
    await testEnv.DB.exec(
      `INSERT INTO group_member (groupId, userId, joinedAt, status, updatedAt) VALUES ('${groupId}', 'user_1', strftime('%s','now'), NULL, strftime('%s','now'));`
    );

    // Create a personal goal for comparison
    await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Personal Goal",
          description: null,
          stakeCents: 100,
          currency: "CHF",
          startDate: new Date().toISOString(),
          endDate: null,
          dueStartTime: new Date().toISOString(),
          dueEndTime: null,
          method: "checkin",
          graceTimeSeconds: 60,
          destinationType: "user",
          destinationUserId: null,
          destinationCharityId: null,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );

    // Get goals list
    const res = await app.request("/api/goals", {}, env);
    expect(res.status).toBe(200);
    const items = (await res.json()) as GoalsListResponse;
    
    // Should have both personal goal and group goal
    expect(items.length).toBe(2);
    const goalNames = items.map((g) => g.name).sort();
    expect(goalNames).toEqual(["Group Goal", "Personal Goal"]);
    
    // Check that the group goal has the correct groupId
    const groupGoal = items.find(g => g.name === "Group Goal");
    expect(groupGoal).toBeDefined();
    expect(groupGoal!.groupId).toBe(groupId);
    
    // Check that the personal goal has no groupId
    const personalGoal = items.find(g => g.name === "Personal Goal");
    expect(personalGoal).toBeDefined();
    expect(personalGoal!.groupId).toBeNull();
  });
});
