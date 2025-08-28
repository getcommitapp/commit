import app from "../index";
import { env } from "cloudflare:test";
import type { GroupDetails, GroupSummary } from "@commit/types";
import { describe, expect, it } from "vitest";

describe("GET /api/groups/:id (fetch)", () => {
  it("returns 404 for unknown id", async () => {
    const res = await app.request("/api/groups/does-not-exist", {}, env);
    expect(res.status).toBe(404);
  });

  it("fetches an existing group with members", async () => {
    // create a group first
    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({ name: "Runners", description: null }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(createRes.status).toBe(200);
    const created: GroupSummary = await createRes.json();

    const res = await app.request(`/api/groups/${created.id}`, {}, env);
    expect(res.status).toBe(200);
    const full: GroupDetails = await res.json();
    expect(full.id).toBe(created.id);
    expect(full.name).toBe("Runners");
    expect(Array.isArray(full.members)).toBe(true);
    expect(full.members.length).toBeGreaterThanOrEqual(1);
  });
});
