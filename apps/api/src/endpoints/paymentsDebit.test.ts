import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type {
  PaymentsChargeRequest,
  PaymentsChargeResponse,
} from "@commit/types";

describe("POST /api/payments/debit", () => {
  it("creates a payment intent and returns its summary", async () => {
    const body: PaymentsChargeRequest = {
      amountCents: 1500,
      currency: "CHF",
    };

    const res = await app.request(
      "/api/payments/debit",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const data: PaymentsChargeResponse = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.status).toBeTruthy();
  });

  it("validates payload and returns 400/422 on bad input", async () => {
    const res = await app.request(
      "/api/payments/debit",
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
