import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { PaymentsRefundResponse } from "@commit/types";

describe("POST /api/payments/refund", () => {
  it("creates a refund for a PaymentIntent", async () => {
    const res = await app.request(
      "/api/payments/refund",
      {
        method: "POST",
        body: JSON.stringify({ paymentIntentId: "pi_123" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as PaymentsRefundResponse;
    expect(body.id).toBe("re_123");
    expect(body.status).toBe("succeeded");
  });
});
