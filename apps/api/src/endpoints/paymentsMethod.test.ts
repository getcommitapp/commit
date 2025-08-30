import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import type { PaymentsMethodResponse } from "@commit/types";
import { StripeService } from "../services/stripeService";

describe("GET /api/payments/method", () => {
  it("returns inactive when no default card exists", async () => {
    const res = await app.request("/api/payments/method", {}, env);
    expect(res.status).toBe(200);
    const data: PaymentsMethodResponse = await res.json();
    expect(data.status).toBe("inactive");
    expect(data.method).toBeNull();
  });

  it("returns active with card summary when default exists", async () => {
    vi.spyOn(
      StripeService.prototype,
      "getDefaultCardSummary"
    ).mockResolvedValueOnce({
      brand: "visa",
      last4: "4242",
      expMonth: 10,
      expYear: 2031,
    });

    const res = await app.request("/api/payments/method", {}, env);
    expect(res.status).toBe(200);
    const data: PaymentsMethodResponse = await res.json();
    expect(data.status).toBe("active");
    expect(data.method?.brand).toBe("visa");
    expect(data.method?.last4).toBe("4242");
  });
});
