import { app } from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type {
  GroupDeleteResponse,
  GroupCreateResponse,
  GoalCreateResponse,
} from "@commit/types";

describe("DELETE /api/groups/:id (delete)", () => {
  it("creator can delete their own group", async () => {
    // Create a goal first
    const goalRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test Goal",
          description: "A test goal",
          startDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          endDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (expired)
          dueStartTime: new Date(Date.now() - 86400000).toISOString(),
          dueEndTime: new Date(Date.now() - 3600000).toISOString(),
          stakeCents: 1000,
          currency: "USD",
          destinationType: "charity",
          method: "checkin",
          graceTimeSeconds: 60,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    await goalRes.json<GoalCreateResponse>();

    // Create a group
    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({
          name: "MyGroup",
          description: "A test group",
          goal: {
            name: "Test Goal",
            description: "A test goal",
            startDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            endDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (expired)
            dueStartTime: new Date(Date.now() - 86400000).toISOString(),
            dueEndTime: new Date(Date.now() - 3600000).toISOString(),
            stakeCents: 1000,
            currency: "USD",
            destinationType: "charity",
            method: "checkin",
            graceTimeSeconds: 60,
          },
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const group = await createRes.json<GroupCreateResponse>();

    // Delete the group
    const res = await app.request(
      `/api/groups/${group.id}`,
      { method: "DELETE" },
      env
    );
    expect(res.status).toBe(200);
    const json: GroupDeleteResponse = await res.json();
    expect(json.message).toBe("Group and associated goal deleted.");
  });

  it("deletes both group and associated goal", async () => {
    // Create a group (which creates a goal internally)
    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Group to Delete",
          description: "A test group to be deleted",
          goal: {
            name: "Test Goal for Deletion",
            description: "A test goal to be deleted",
            startDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            endDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (expired)
            dueStartTime: new Date(Date.now() - 86400000).toISOString(),
            dueEndTime: new Date(Date.now() - 3600000).toISOString(),
            stakeCents: 1000,
            currency: "USD",
            destinationType: "charity",
            method: "checkin",
            graceTimeSeconds: 60,
          },
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const group = await createRes.json<GroupCreateResponse>();

    // Get the goal ID from the group's goalId field
    const goalId = group.goalId;

    // Verify both goal and group exist before deletion
    const goalCheckRes = await app.request(`/api/goals/${goalId}`, {}, env);
    expect(goalCheckRes.status).toBe(200);

    const groupCheckRes = await app.request(`/api/groups/${group.id}`, {}, env);
    expect(groupCheckRes.status).toBe(200);

    // Delete the group
    const deleteRes = await app.request(
      `/api/groups/${group.id}`,
      { method: "DELETE" },
      env
    );
    expect(deleteRes.status).toBe(200);

    // Verify both goal and group are deleted
    const goalAfterDeleteRes = await app.request(
      `/api/goals/${goalId}`,
      {},
      env
    );
    expect(goalAfterDeleteRes.status).toBe(404);

    const groupAfterDeleteRes = await app.request(
      `/api/groups/${group.id}`,
      {},
      env
    );
    expect(groupAfterDeleteRes.status).toBe(404);
  });

  it("non-creator cannot delete a group", async () => {
    // Create a goal first
    const goalRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test Goal",
          description: "A test goal",
          startDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          endDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (expired)
          dueStartTime: new Date(Date.now() - 86400000).toISOString(),
          dueEndTime: new Date(Date.now() - 3600000).toISOString(),
          stakeCents: 1000,
          currency: "USD",
          destinationType: "charity",
          method: "checkin",
          graceTimeSeconds: 60,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const goal = await goalRes.json<GoalCreateResponse>();

    // Create a group with user_2 as creator
    const groupId = crypto.randomUUID();
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    await testEnv.DB.exec(
      `INSERT INTO "group" (id, creatorId, goalId, name, inviteCode, updatedAt) VALUES ('${groupId}', 'user_2', '${goal.id}', 'Their Group', 'INV123', strftime('%s','now'));`
    );

    // Try to delete the group as user_1 (not the creator)
    const res = await app.request(
      `/api/groups/${groupId}`,
      { method: "DELETE" },
      env
    );
    expect(res.status).toBe(403);
  });

  it("returns 404 for non-existent group", async () => {
    const nonExistentId = crypto.randomUUID();
    const res = await app.request(
      `/api/groups/${nonExistentId}`,
      { method: "DELETE" },
      env
    );
    expect(res.status).toBe(404);
  });
});
