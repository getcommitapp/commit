import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupInviteGetResponse, GroupSummary } from "@commit/types";
// no drizzle insert here; use raw SQL for table named "group"

describe("GET /api/groups/:id/invite (invite)", () => {
  it("returns invite code for group creator", async () => {
    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({ name: "Chess", description: null }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const group: GroupSummary = await createRes.json();

    const res = await app.request(`/api/groups/${group.id}/invite`, {}, env);
    expect(res.status).toBe(200);
    const data: GroupInviteGetResponse = await res.json();
    expect(data.inviteCode).toBeTruthy();
  });

  it("returns 403 when requester is not the creator", async () => {
    // Create a group with a different creator directly via Drizzle
    const groupId = crypto.randomUUID();
    // Ensure other user exists
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, updatedAt) VALUES ('user_2','Other','other@example.com',1,NULL,strftime('%s','now'));`
    );
    await testEnv.DB.exec(
      `INSERT INTO "group" (id, creatorId, name, inviteCode, updatedAt) VALUES ('${groupId}', 'user_2', 'Their Group', 'ABCDEF', strftime('%s','now'));`
    );

    const res = await app.request(`/api/groups/${groupId}/invite`, {}, env);
    expect(res.status).toBe(403);
  });
});
