import app from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type {
  GroupGoalGetResponse,
  GroupSummary,
  GoalCreateResponse,
} from "@commit/types";

describe("GET /api/groups/:id/goal (goal)", () => {
  it("returns 404 when group has no goal", async () => {
    const createGroup = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({ name: "NoGoal", description: null }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const g: GroupSummary = await createGroup.json();
    const res = await app.request(`/api/groups/${g.id}/goal`, {}, env);
    expect(res.status).toBe(404);
  });

  it("returns goal details when group has a goal", async () => {
    // Create group
    const createGroup = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({ name: "HasGoal", description: null }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const g: GroupSummary = await createGroup.json();

    // Create a goal directly via API to ensure owner is user_1
    const goalRes = await app.request(
      "/api/goals",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Run",
          description: null,
          stakeCents: 100,
          currency: "USD",
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
    const goal: GoalCreateResponse = await goalRes.json();

    // Link goal to group
    await testEnv.DB.exec(
      `UPDATE \`group\` SET goalId='${goal.id}', updated_at=strftime('%s','now') WHERE id='${g.id}';`
    );

    const res = await app.request(`/api/groups/${g.id}/goal`, {}, env);
    expect(res.status).toBe(200);
    const data: GroupGoalGetResponse = await res.json();
    expect(data.id).toBe(goal.id);
    expect(Array.isArray(data.verificationMethods)).toBe(true);
  });
});
