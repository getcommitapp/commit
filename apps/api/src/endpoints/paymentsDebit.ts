import { OpenAPIRoute, contentJson } from "chanfana";
import { type AppContext } from "../types";
import { StripeService } from "../services/stripeService";
import {
  PaymentsChargeRequestSchema,
  PaymentsChargeResponseSchema,
} from "@commit/types";

export class PaymentsCharge extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Create a PaymentIntent to charge a customer",
    request: {
      body: contentJson(PaymentsChargeRequestSchema),
    },
    responses: {
      "200": {
        description: "PaymentIntent created",
        content: {
          "application/json": {
            schema: PaymentsChargeResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const body = await this.getValidatedData<typeof this.schema>();
    const input = body.body;
    const stripe = new StripeService(c);
    const paymentIntent = await stripe.createPaymentIntent(input);

    return c.json({ id: paymentIntent.id, status: paymentIntent.status }, 200);
  }
}
