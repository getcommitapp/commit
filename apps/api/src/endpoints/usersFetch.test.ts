import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { UserGetResponse } from "@commit/types";

describe("GET /api/users (fetch current user)", () => {
  it("returns the currently authenticated user", async () => {
    const res = await app.request("/api/users", {}, env);
    expect(res.status).toBe(200);
    const user: UserGetResponse = await res.json();
    expect(user.id).toBe("user_1");
    expect(typeof user.email).toBe("string");
    expect(user.email.includes("@")).toBe(true);
    expect(typeof user.name).toBe("string");
  expect(["user", "admin", "reviewer"]).toContain(user.role);
  });
});
