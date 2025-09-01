import { app } from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type {
  GroupInviteVerifyResponse,
  GroupCreateResponse,
} from "@commit/types";

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
        body: JSON.stringify({
          name: "Code",
          description: null,
          goal: {
            name: "Test Goal",
            description: "A test goal",
            startDate: new Date().toISOString(),
            dueStartTime: new Date().toISOString(),
            dueEndTime: new Date(Date.now() + 3600000).toISOString(),
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
