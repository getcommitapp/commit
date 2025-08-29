import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type {
  PaymentsRefundRequest,
  PaymentsRefundResponse,
} from "@commit/types";

describe("POST /api/payments/refund", () => {
  it("creates a refund and returns its summary", async () => {
    const body: PaymentsRefundRequest = {
      paymentIntentId: "pi_123",
    };

    const res = await app.request(
      "/api/payments/refund",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const data: PaymentsRefundResponse = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.status).toBe("succeeded");
  });

  it("validates payload and returns 400/422 on bad input", async () => {
    const res = await app.request(
      "/api/payments/refund",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect([400, 422]).toContain(res.status);
  });
});
