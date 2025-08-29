import { OpenAPIRoute, contentJson } from "chanfana";
import { type AppContext } from "../types";
import { StripeService } from "../services/stripe";
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
    const stripe = new StripeService(c);
    const refund = await stripe.refundPaymentIntent(
      input.paymentIntentId,
      input.amountCents
    );
    return c.json({ id: refund.id, status: refund.status }, 200);
  }
}
