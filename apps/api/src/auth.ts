import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { expo } from "@better-auth/expo";
import { stripe as betterAuthStripe } from "@better-auth/stripe";
import Stripe from "stripe";
import * as schema from "./db/schema";

export function createAuth(env: Env) {
  const db = drizzle(env.DB, { schema });
  // Validate required env within the request context (Cloudflare Workers)
  const {
    AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET,
    AUTH_APPLE_CLIENT_ID,
    AUTH_APPLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
  } = env;

  const stripeClient = new Stripe(STRIPE_SECRET_KEY ?? "");

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      // map Better Auth expected names to our schema when needed
      schema: {
        ...schema,
        user: schema.User,
        account: schema.Account,
        session: schema.Session,
        verification: schema.Verification,
      },
    }),
    plugins: [
      expo(),
      betterAuthStripe({
        stripeClient,
        stripeWebhookSecret: STRIPE_WEBHOOK_SECRET ?? "",
        createCustomerOnSignUp: true,
      }) as unknown as any,
    ],
    trustedOrigins: ["commit://", "commit://*", "exp://", "exp://*"],
    socialProviders: {
      google: {
        clientId: AUTH_GOOGLE_CLIENT_ID ?? "",
        clientSecret: AUTH_GOOGLE_CLIENT_SECRET ?? "",
        scope: ["openid", "email", "profile"],
      },
      apple: {
        clientId: AUTH_APPLE_CLIENT_ID ?? "",
        clientSecret: AUTH_APPLE_CLIENT_SECRET ?? "",
      },
    },
  });
}
