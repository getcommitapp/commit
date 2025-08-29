import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { PaymentsSetupIntentResponse } from "@commit/types";

describe("POST /api/payments/setup-intent", () => {
  it("returns a client secret", async () => {
    const res = await app.request(
      "/api/payments/setup-intent",
      { method: "POST" },
      env
    );
    expect(res.status).toBe(200);
    const data: PaymentsSetupIntentResponse = await res.json();
    expect(data.clientSecret).toBeTruthy();
  });
});
