import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { GoalCreateResponse, GoalOccurrence } from "@commit/types";

describe("Goals review endpoints", () => {
  it("rejects review list for non-reviewer", async () => {
    const res = await app.request("/api/goals/review", {}, env);
    expect(res.status).toBe(403);
  });

  it("allows reviewer to list pending verifications and update status", async () => {
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
    const created = await createRes.json<GoalCreateResponse>();

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

    // Elevate default test user to reviewer role (auth mock reads this)
    await testEnv.DB.exec(
      `UPDATE user SET role = 'reviewer' WHERE id = 'user_1';`
    );

    // Reviewer lists pending verifications
    const listRes = await app.request("/api/goals/review", {}, env);
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
        }),
      },
      env
    );
    expect(updRes.status).toBe(200);
    const updated = await updRes.json<GoalOccurrence>();
    expect(updated.status).toBe("approved");
  });
});
