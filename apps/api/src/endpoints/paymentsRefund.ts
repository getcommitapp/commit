import { OpenAPIRoute, contentJson } from "chanfana";
import { type AppContext } from "../types";
import Stripe from "stripe";
import {
  PaymentsRefundRequestSchema,
  PaymentsRefundResponseSchema,
} from "@commit/types";

export class PaymentsRefund extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Refund a PaymentIntent",
    request: {
      body: contentJson(PaymentsRefundRequestSchema),
    },
    responses: {
      "200": {
        description: "Refund created",
        content: {
          "application/json": {
            schema: PaymentsRefundResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const body = await this.getValidatedData<typeof this.schema>();
    const input = body.body;
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(
      input.paymentIntentId
    );
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntent.id,
      amount: input.amountCents,
    });
    return c.json({ id: refund.id, status: refund.status }, 200);
  }
}
