import { OpenAPIRoute, contentJson } from "chanfana";
import { type AppContext } from "../types";
import Stripe from "stripe";
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
    const user = c.var.user!;
    const body = await this.getValidatedData<typeof this.schema>();
    const input = body.body;
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    const customerId = input.customerId || user?.stripeCustomerId;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: input.amountCents,
        currency: input.currency,
        customer: customerId,
        payment_method: input.paymentMethodId,
        confirm: !!input.paymentMethodId,
        off_session: !!input.paymentMethodId,
        automatic_payment_methods: input.paymentMethodId
          ? undefined
          : { enabled: true },
      },
      input.idempotencyKey
        ? { idempotencyKey: input.idempotencyKey }
        : undefined
    );

    return c.json({ id: paymentIntent.id, status: paymentIntent.status }, 200);
  }
}
