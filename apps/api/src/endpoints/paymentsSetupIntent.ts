import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import { PaymentsSetupIntentResponseSchema } from "@commit/types";
import { StripeService } from "../services/stripeService";

export class PaymentsSetupIntent extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Create a SetupIntent to save a card",
    responses: {
      "200": {
        description: "Returns the client secret for the SetupIntent",
        content: {
          "application/json": {
            schema: PaymentsSetupIntentResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const stripe = new StripeService(c);
    const setupIntent = await stripe.createSetupIntent();
    return c.json({ clientSecret: setupIntent.client_secret }, 200);
  }
}
