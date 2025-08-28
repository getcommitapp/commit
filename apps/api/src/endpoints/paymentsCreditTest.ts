import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import Stripe from "stripe";

export class PaymentsCreditTest extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Test: credit 10 CHF to customer balance (non-refund)",
    responses: {
      "200": {
        description: "Customer balance credit created",
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    const customerId = user?.stripeCustomerId;

    if (!customerId) {
      return c.json({ error: "User has no Stripe customer" }, 400);
    }

    // Add a credit to the customer's balance (applies to future invoices)
    const tx = await stripe.customers.createBalanceTransaction(customerId, {
      amount: -1000, // negative to credit 10 CHF
      currency: "chf",
      description: "Test credit 10 CHF",
    });

    return c.json({ id: tx.id, amount: tx.amount, currency: tx.currency }, 200);
  }
}
