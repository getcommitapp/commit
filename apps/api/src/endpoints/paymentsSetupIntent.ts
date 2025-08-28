import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import Stripe from "stripe";
import { PaymentsSetupIntentResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

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
    console.log("[PaymentsSetupIntent] Starting setup intent creation");

    const user = c.var.user!;
    console.log("[PaymentsSetupIntent] User ID:", user.id);
    console.log("[PaymentsSetupIntent] User email:", user.email);

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    console.log("[PaymentsSetupIntent] Stripe instance created");

    let customerId = user?.stripeCustomerId as string | undefined | null;
    console.log(
      "[PaymentsSetupIntent] Stripe customer ID:",
      customerId || "Not found"
    );

    // If no Stripe customer, create one now and persist
    if (!customerId) {
      console.log("[PaymentsSetupIntent] Creating Stripe customer for user...");
      const created = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = created.id;
      console.log("[PaymentsSetupIntent] Stripe customer created:", customerId);

      const db = drizzle(c.env.DB, { schema });
      await db
        .update(schema.User)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() as any })
        .where(eq(schema.User.id, user.id));
      // reflect in request context for downstream handlers this request
      (c.var.user as any).stripeCustomerId = customerId;
    }

    const customer = customerId ? { customer: customerId } : {};
    console.log("[PaymentsSetupIntent] Customer config:", customer);

    console.log("[PaymentsSetupIntent] Creating Stripe setup intent...");
    const setupIntent = await stripe.setupIntents.create({
      usage: "off_session",
      ...customer,
    });
    console.log("[PaymentsSetupIntent] Setup intent created successfully");
    console.log("[PaymentsSetupIntent] Setup intent ID:", setupIntent.id);
    console.log(
      "[PaymentsSetupIntent] Setup intent status:",
      setupIntent.status
    );

    const response = { clientSecret: setupIntent.client_secret };
    console.log("[PaymentsSetupIntent] Returning response with client secret");

    return c.json(response, 200);
  }
}
