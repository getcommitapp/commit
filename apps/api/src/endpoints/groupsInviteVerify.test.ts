import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupInviteVerifyResponse, GroupSummary } from "@commit/types";

describe("GET /api/groups/:id/invite/verify (verify)", () => {
  it("returns valid=false for unknown code", async () => {
    const res = await app.request(
      "/api/groups/any/invite/verify?code=UNKNOWN",
      {},
      env
    );
    expect(res.status).toBe(200);
    const json: GroupInviteVerifyResponse = await res.json();
    expect(json.valid).toBe(false);
  });

  it("returns valid=true for existing group's code", async () => {
    const createRes = await app.request(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify({ name: "Code", description: null }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    const group: GroupSummary = await createRes.json();

    const res = await app.request(
      `/api/groups/${group.id}/invite/verify?code=${group.inviteCode}`,
      {},
      env
    );
    expect(res.status).toBe(200);
    const json: GroupInviteVerifyResponse = await res.json();
    expect(json.valid).toBe(true);
  });
});
