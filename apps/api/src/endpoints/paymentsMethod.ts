import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import { StripeService } from "../services/stripe";
import { PaymentsMethodResponseSchema } from "@commit/types";

export class PaymentsMethod extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Fetch user's default payment method and status",
    responses: {
      "200": {
        description: "Payment method/status",
        content: {
          "application/json": {
            schema: PaymentsMethodResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const stripe = new StripeService(c);
    const summary = await stripe.getDefaultCardSummary();
    if (!summary) return c.json({ status: "inactive", method: null }, 200);
    return c.json({ status: "active", method: summary }, 200);
  }
}
