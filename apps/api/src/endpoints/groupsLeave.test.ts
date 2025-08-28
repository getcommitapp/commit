import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupLeaveResponse, GroupSummary } from "@commit/types";

describe("POST /api/groups/:id/leave (leave)", () => {
  it("creator cannot leave their own group", async () => {
    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({ name: "MyGroup", description: null }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const g: GroupSummary = await createRes.json();
    const res = await app.request(
      `/api/groups/${g.id}/leave`,
      { method: "POST" },
      env
    );
    expect(res.status).toBe(400);
  });

  it("participant can leave successfully", async () => {
    // Create a group with creator user_2 and add user_1 as participant
    const groupId = crypto.randomUUID();
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    await testEnv.DB.exec(
      `INSERT INTO "group" (id, creatorId, name, inviteCode, updatedAt) VALUES ('${groupId}', 'user_2', 'Their Group', 'INV123', strftime('%s','now'));`
    );
    await testEnv.DB.exec(
      `INSERT INTO group_participants (groupId, userId, joinedAt, status, updatedAt) VALUES ('${groupId}', 'user_1', strftime('%s','now'), NULL, strftime('%s','now'));`
    );

    const res = await app.request(
      `/api/groups/${groupId}/leave`,
      { method: "POST" },
      env
    );
    expect(res.status).toBe(200);
    const json: GroupLeaveResponse = await res.json();
    expect(json.message).toBe("Left group successfully.");
  });
});
