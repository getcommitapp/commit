import { app } from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("POST /api/files/upload", () => {
  it("rejects when not multipart", async () => {
    const res = await app.request(
      "/api/files/upload",
      { method: "POST", body: "not-multipart" },
      env
    );
    expect([400, 401]).toContain(res.status);
  });

  it("stores file to R2 and returns url + key", async () => {
    const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const body =
      `--${boundary}\r\n` +
      'Content-Disposition: form-data; name="file"; filename="test.txt"\r\n' +
      "Content-Type: text/plain\r\n\r\n" +
      "hello world\r\n" +
      `--${boundary}--\r\n`;

    const res = await app.request(
      "/api/files/upload",
      {
        method: "POST",
        body,
        headers: new Headers({
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        }),
      },
      env
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { url: string; key: string };
    expect(json.url).toMatch(/^\/api\/files\//);
    expect(json.key).toMatch(/^users\//);
  });
});
