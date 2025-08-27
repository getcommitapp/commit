import { describe, it, expect } from "vitest";
import app from "../src/index";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";

describe("GET /goals", () => {
  it("returns success true", async () => {
    const request = new Request("http://localhost/goals");
    const ctx = createExecutionContext();

    // Hono apps are Workers-style fetch handlers via app.fetch
    const response = await app.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ success: true });
  });
});
