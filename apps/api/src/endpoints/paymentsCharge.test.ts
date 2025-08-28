import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { PaymentsChargeResponse } from "@commit/types";

describe("POST /api/payments/charge", () => {
  it("creates and returns a PaymentIntent", async () => {
    const res = await app.request(
      "/api/payments/charge",
      {
        method: "POST",
        body: JSON.stringify({ amountCents: 500, currency: "CHF" }),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as PaymentsChargeResponse;
    expect(body.id).toBe("pi_123");
    expect(body.status).toBe("succeeded");
  });
});
