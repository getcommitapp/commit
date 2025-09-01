import { app } from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { UserDeleteResponse } from "@commit/types";

describe("DELETE /api/users (delete)", () => {
  it("deletes the current user and returns a message", async () => {
    const res = await app.request("/api/users", { method: "DELETE" }, env);
    expect(res.status).toBe(200);
    const body: UserDeleteResponse = await res.json();
    expect(typeof body.message).toBe("string");
  });
});
