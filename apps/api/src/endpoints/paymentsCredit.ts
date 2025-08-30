import { OpenAPIRoute, contentJson } from "chanfana";
import { type AppContext } from "../types";
import { StripeService } from "../services/stripeService";
import { z } from "zod";

const PaymentsCreditRequestSchema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.string().min(1),
  description: z.string().optional(),
});

const PaymentsCreditResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
});

export class PaymentsCredit extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Credit customer balance (non-refund)",
    request: {
      body: contentJson(PaymentsCreditRequestSchema),
    },
    responses: {
      "200": {
        description: "Customer balance credit created",
        content: {
          "application/json": {
            schema: PaymentsCreditResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const body = await this.getValidatedData<typeof this.schema>();
    const input = body.body;
    const stripe = new StripeService(c);
    const tx = await stripe.creditCustomerBalance(
      input.amountCents,
      input.currency,
      input.description
    );
    return c.json({ id: tx.id, amount: tx.amount, currency: tx.currency }, 200);
  }
}
