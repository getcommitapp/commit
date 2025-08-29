import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("POST /api/payments/credit", () => {
  it("credits the customer balance and returns transaction", async () => {
    const body = {
      amountCents: 500,
      currency: "CHF",
      description: "Goodwill",
    };

    const res = await app.request(
      "/api/payments/credit",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({ "Content-Type": "application/json" }),
      },
      env
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.amount).toBeDefined();
    expect(data.currency).toBeDefined();
  });

  it("validates payload and returns 400/422 on bad input", async () => {
    const res = await app.request(
      "/api/payments/credit",
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
