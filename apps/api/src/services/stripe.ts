import Stripe from "stripe";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";
import type { AppContext } from "../types";

type CreatePaymentIntentInput = {
  amountCents: number;
  currency: string;
  customerId?: string | null;
  paymentMethodId?: string | null;
  idempotencyKey?: string | null;
};

export class StripeService {
  private readonly c: AppContext;
  private readonly stripe: Stripe;

  constructor(c: AppContext) {
    this.c = c;
    this.stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  }

  async ensureStripeCustomerId(): Promise<string> {
    const user = this.c.var.user!;
    if (user.stripeCustomerId) return user.stripeCustomerId;

    const created = await this.stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });

    const db = drizzle(this.c.env.DB, { schema });
    await db
      .update(schema.User)
      .set({ stripeCustomerId: created.id, updatedAt: new Date() })
      .where(eq(schema.User.id, user.id));

    if (this.c.var.user) {
      (
        this.c.var.user as typeof this.c.var.user & { stripeCustomerId: string }
      ).stripeCustomerId = created.id;
    }
    return created.id;
  }

  async createSetupIntent() {
    const customerId = await this.ensureStripeCustomerId();
    const setupIntent = await this.stripe.setupIntents.create({
      usage: "off_session",
      customer: customerId,
    });
    return setupIntent;
  }

  async createPaymentIntent(input: CreatePaymentIntentInput) {
    const customerId =
      input.customerId || this.c.var.user?.stripeCustomerId || undefined;
    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: input.amountCents,
        currency: input.currency,
        customer: customerId,
        payment_method: input.paymentMethodId || undefined,
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
    return paymentIntent;
  }

  async refundPaymentIntent(paymentIntentId: string, amountCents?: number) {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntent.id,
      amount: amountCents,
    });
    return refund;
  }

  async creditCustomerBalance(
    amountCents: number,
    currency: string,
    description?: string
  ) {
    const customerId = await this.ensureStripeCustomerId();
    const tx = await this.stripe.customers.createBalanceTransaction(
      customerId,
      {
        amount: -Math.abs(amountCents),
        currency: currency.toLowerCase(),
        description,
      }
    );
    return tx;
  }

  async getDefaultCardSummary() {
    const user = this.c.var.user!;
    const customerId =
      user.stripeCustomerId || (await this.ensureStripeCustomerId());

    const customer = await this.stripe.customers.retrieve(customerId);
    const invoiceSettings = (customer as Stripe.Customer).invoice_settings;
    let defaultPaymentMethodId = invoiceSettings?.default_payment_method as
      | string
      | null
      | undefined;

    if (!defaultPaymentMethodId) {
      const methods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
        limit: 1,
      });
      const candidate = methods.data[0];
      defaultPaymentMethodId = candidate?.id;
    }

    if (!defaultPaymentMethodId) return null;

    const pm = await this.stripe.paymentMethods.retrieve(
      defaultPaymentMethodId
    );
    const card = (pm as Stripe.PaymentMethod).card;
    if (!card) return null;
    return {
      brand: card.brand,
      last4: card.last4,
      expMonth: card.exp_month,
      expYear: card.exp_year,
    };
  }
}
