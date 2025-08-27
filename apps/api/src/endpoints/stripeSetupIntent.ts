import { OpenAPIRoute } from 'chanfana';
import type { AppContext } from '../types';

// Minimal types to avoid adding stripe SDK server-side if not present yet
interface StripeLike {
  customers: { create(params: any): Promise<any> };
  ephemeralKeys: { create(params: any, opts: any): Promise<any> };
  setupIntents: { create(params: any): Promise<any> };
}

export class StripeSetupIntent extends OpenAPIRoute {
  schema = {
    tags: ['Stripe'],
    summary: 'Create SetupIntent + Ephemeral Key for saving a payment method',
    responses: {
      '200': { description: 'Client secret and ephemeral key' },
    },
  };

  async handle(c: AppContext) {
    const STRIPE_SECRET = c.env.STRIPE_SECRET_KEY as string | undefined;
    if (!STRIPE_SECRET) {
      return { error: 'Stripe secret key not configured' };
    }
    // Dynamically import stripe to keep edge bundle light if unused
    // @ts-ignore
    const Stripe = (await import('stripe')).default; // assume dependency added at build
    const stripe: StripeLike = new Stripe(STRIPE_SECRET, { apiVersion: '2024-06-20' });

    // In real impl you'd map c.get('user') to a stripeCustomerId in DB
    // For test phase create a new customer each time (NOT for production)
    const customer = await stripe.customers.create({});

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-06-20' }
    );

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    return {
      customerId: customer.id,
      ephemeralKey: ephemeralKey.secret,
      setupIntentClientSecret: setupIntent.client_secret,
      publishableKey: c.env.STRIPE_PUBLISHABLE_KEY,
    };
  }
}
