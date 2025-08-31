import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { v7 as uuid } from "uuid";

describe("Goals review endpoints", () => {
  it("rejects review list for non-reviewer", async () => {
    const res = await app.request("/api/goals/review", {}, env);
    expect(res.status).toBe(403);
  });

  it("allows reviewer to list pending verifications and update status", async () => {
    // Seed reviewer user and session for dev auto-auth
    const reviewerId = "reviewer_1";
    const reviewerEmail = "reviewer@example.com";
    await testEnv.DB.exec(
      `INSERT INTO user (id, name, email, emailVerified, image, role, updatedAt) VALUES ('${reviewerId}','Reviewer','${reviewerEmail}',1,NULL,'reviewer',strftime('%s','now'));`
    );
    const sessionId = uuid();
    const token = uuid();
    await testEnv.DB.exec(
      `INSERT INTO session (id, expiresAt, token, updatedAt, userId, createdAt) VALUES ('${sessionId}', strftime('%s','now', '+1 day'), '${token}', strftime('%s','now'), '${reviewerId}', strftime('%s','now'));`
    );
    // Create a goal for user_1
    const createRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Photo goal",
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
    const created = await createRes.json();

    // Create a pending occurrence with a photo by calling photo endpoint
    const photoRes = await app.request(
      `/api/goals/${created.id}/photo`,
      {
        method: "POST",
        body: JSON.stringify({
          photoUrl: "https://example.com/p.jpg",
          description: "proof",
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(photoRes.status).toBe(200);

    // Reviewer lists pending verifications
    const listRes = await app.request(
      "/api/goals/review",
      {
        headers: new Headers({ "X-Commit-Dev-Auto-Auth": reviewerEmail }),
      },
      env
    );
    expect(listRes.status).toBe(200);
    const items = (await listRes.json()) as Array<{
      goalId: string;
      photoUrl: string | null;
    }>;
    const item = items.find((i) => i.goalId === created.id);
    expect(item?.photoUrl).toBeTruthy();

    // Reviewer approves the occurrence
    const updRes = await app.request(
      `/api/goals/${created.id}/review`,
      {
        method: "PUT",
        body: JSON.stringify({ approvalStatus: "approved" }),
        headers: new Headers({
          "Content-Type": "application/json",
          "X-Commit-Dev-Auto-Auth": reviewerEmail,
        }),
      },
      env
    );
    expect(updRes.status).toBe(200);
    const updated = await updRes.json();
    expect(updated.status).toBe("approved");
  });
});
