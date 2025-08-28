import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { UserUpdateResponse } from "@commit/types";

describe("PUT /api/users (update)", () => {
  it("updates the current user's name and returns the updated user", async () => {
    const newName = `Test User ${Date.now()}`;
    const res = await app.request(
      "/api/users",
      {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const updated = await res.json<UserUpdateResponse>();
    expect(updated.name).toBe(newName);
    expect(updated.id).toBe("user_1");
  });

  it("rejects empty payload (no fields)", async () => {
    const res = await app.request(
      "/api/users",
      {
        method: "PUT",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect([400, 422]).toContain(res.status);
  });

  // Role changes are not supported via API in MVP; handled manually via DB.
});
