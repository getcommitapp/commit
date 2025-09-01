import { app } from "../index";
import { env } from "cloudflare:test";
import type { GroupBase } from "@commit/types";
import { describe, expect, it } from "vitest";

describe("GET /api/groups/:id (fetch)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request("/api/groups/does-not-exist", {}, env);
    expect(res.status).toBe(404);
  });

  it("fetches an existing group", async () => {
    // Create a group first
    const goal = {
      name: "Tmp Goal",
      description: "A goal for the group",
      startDate: new Date().toISOString(),
      dueStartTime: new Date().toISOString(),
      dueEndTime: null,
      stakeCents: 100,
      currency: "CHF",
      destinationType: "charity",
      method: "checkin",
      graceTimeSeconds: 60,
    };

    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Testers",
          description: "QA Group",
          goal,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(createRes.status).toBe(200);
    const created = (await createRes.json()) as GroupBase & {
      inviteCode: string;
    };

    const res = await app.request(`/api/groups/${created.id}`, {}, env);
    expect(res.status).toBe(200);
    const body = (await res.json()) as GroupBase;
    expect(body.id).toBe(created.id);
    expect(body.name).toBe("Testers");
  });
});
