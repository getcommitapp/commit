import { app } from "../index";
import { env, env as testEnv } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("GET /api/files/:key (serve)", () => {
  it("returns 403 for non-reviewer", async () => {
    const res = await app.request("/api/files/some/key.txt", {}, env);
    expect(res.status).toBe(403);
  });

  it("returns 404 when object is missing", async () => {
    await testEnv.DB.exec(
      `INSERT OR IGNORE INTO user (id, role) VALUES ('reviewer_1','reviewer');`
    );
    await testEnv.DB.exec(
      `UPDATE user SET role = 'reviewer' WHERE id = 'reviewer_1';`
    );
    const reviewerEnv = { ...env, user: { id: "reviewer_1" } } as typeof env;
    const res = await app.request("/api/files/missing.txt", {}, reviewerEnv);
    expect(res.status).toBe(404);
  });

  it("serves stored object with content-type", async () => {
    await testEnv.DB.exec(
      `INSERT OR IGNORE INTO user (id, role) VALUES ('reviewer_1','reviewer');`
    );
    await testEnv.DB.exec(
      `UPDATE user SET role = 'reviewer' WHERE id = 'reviewer_1';`
    );
    const reviewerEnv = { ...env, user: { id: "reviewer_1" } } as typeof env;
    // Put object into R2 mock
    const key = "users/user_1/2025/01/01/test.txt";
    await reviewerEnv.R2.put(key, new TextEncoder().encode("hello"), {
      httpMetadata: { contentType: "text/plain" },
    });

    const res = await app.request(
      `/api/files/${encodeURIComponent(key)}`,
      {},
      reviewerEnv
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/plain");
    const text = await res.text();
    expect(text).toBe("hello");
  });
});
