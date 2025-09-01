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

  async ensureStripeCustomerIdForUser(userId: string): Promise<string> {
    const db = drizzle(this.c.env.DB, { schema });
    const [user] = await db
      .select()
      .from(schema.User)
      .where(eq(schema.User.id, userId))
      .limit(1);
    if (!user) throw new Error("User not found");
    if (user.stripeCustomerId) return user.stripeCustomerId;

    const created = await this.stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });

    await db
      .update(schema.User)
      .set({ stripeCustomerId: created.id, updatedAt: new Date() })
      .where(eq(schema.User.id, user.id));
    return created.id;
  }

  async createSetupIntent() {
    let customerId = await this.ensureStripeCustomerId();
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        usage: "off_session",
        customer: customerId,
      });
      return setupIntent;
    } catch (_) {
      // Recreate a fresh customer and retry once
      const user = this.c.var.user!;
      const db = drizzle(this.c.env.DB, { schema });
      await db
        .update(schema.User)
        .set({ stripeCustomerId: null, updatedAt: new Date() })
        .where(eq(schema.User.id, user.id));
      if (this.c.var.user) {
        this.c.var.user.stripeCustomerId = null;
      }
      customerId = await this.ensureStripeCustomerId();
      const setupIntent = await this.stripe.setupIntents.create({
        usage: "off_session",
        customer: customerId,
      });
      return setupIntent;
    }
  }

  async createPaymentIntent(input: CreatePaymentIntentInput) {
    const customerId =
      input.customerId || this.c.var.user?.stripeCustomerId || undefined;

    // Resolve default payment method if not provided
    let paymentMethodId = input.paymentMethodId || undefined;
    if (!paymentMethodId && customerId) {
      const defaultPm =
        await this.getDefaultPaymentMethodIdForCustomer(customerId);
      if (defaultPm) {
        paymentMethodId = defaultPm;
      }
    }

    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: input.amountCents,
        currency: input.currency,
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: !!paymentMethodId,
        off_session: !!paymentMethodId,
        automatic_payment_methods: paymentMethodId
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
    description?: string,
    idempotencyKey?: string | null
  ) {
    const customerId = await this.ensureStripeCustomerId();
    const tx = await this.stripe.customers.createBalanceTransaction(
      customerId,
      {
        amount: -Math.abs(amountCents),
        currency: currency.toLowerCase(),
        description,
      },
      idempotencyKey ? { idempotencyKey } : undefined
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

  async getDefaultPaymentMethodIdForCustomer(customerId: string) {
    const customer = await this.stripe.customers.retrieve(customerId);
    let defaultPaymentMethodId = (customer as Stripe.Customer).invoice_settings
      ?.default_payment_method as string | null | undefined;

    if (!defaultPaymentMethodId) {
      const methods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
        limit: 1,
      });
      const candidate = methods.data[0];
      defaultPaymentMethodId = candidate?.id;
    }
    return defaultPaymentMethodId || null;
  }

  // --- Settlement helpers ---
  /**
   * Settle a solo goal failure: debit the owner for the stake amount.
   * Money destination is handled externally by Stripe account routing.
   */
  async settleSoloFailure(goalId: string, occurrenceDate: string) {
    const db = drizzle(this.c.env.DB, { schema });
    const goal = await db.query.Goal.findFirst({
      where: eq(schema.Goal.id, goalId),
    });
    if (!goal) throw new Error("Goal not found");

    // Charge the goal owner for stake amount
    const input = {
      amountCents: goal.stakeCents,
      currency: goal.currency,
      customerId: this.c.var.user?.stripeCustomerId || undefined,
      idempotencyKey: `${goalId}:${occurrenceDate}:solo:debit`,
    } as const;
    const pi = await this.createPaymentIntent(input);
    return pi;
  }

  /**
   * Settle a group goal for a specific date: debit losers and credit winners.
   * Winners split the total losers' stakes evenly.
   */
  async settleGroupPayouts(groupId: string, occurrenceDate: string) {
    const db = drizzle(this.c.env.DB, { schema });

    // Load group with goal and participants
    const group = await db.query.Group.findFirst({
      where: eq(schema.Group.id, groupId),
      with: {
        goal: true,
        participants: true,
        creator: true,
      },
    });
    if (!group) throw new Error("Group not found");
    const goal = group.goal;

    // Participants include creator implicitly
    const memberUserIds = Array.from(
      new Set([group.creatorId, ...group.participants.map((p) => p.userId)])
    );

    // Fetch occurrences for date
    const occs = await db.query.GoalOccurrence.findMany({
      where: (t, { and, inArray, eq: eq2 }) =>
        and(
          eq2(t.goalId, goal.id),
          inArray(t.userId, memberUserIds),
          eq2(t.occurrenceDate, occurrenceDate)
        ),
    });
    const statusByUser = new Map(
      occs.map((o) => [
        o.userId,
        o.status as "approved" | "rejected" | "pending",
      ])
    );

    const winners = memberUserIds.filter(
      (u) => statusByUser.get(u) === "approved"
    );
    const losers = memberUserIds.filter(
      (u) => (statusByUser.get(u) || "pending") !== "approved"
    );

    // No settlement if no winners or no losers
    if (winners.length === 0 || losers.length === 0) {
      return { winners, losers, debits: [], credits: [] } as const;
    }

    // Debit each loser for stake
    const debits = [] as { userId: string; paymentIntentId: string }[];
    for (const loserId of losers) {
      // Impersonate user context for ensureStripeCustomerId if needed
      const customerId = await this.ensureStripeCustomerId();
      const pi = await this.createPaymentIntent({
        amountCents: goal.stakeCents,
        currency: goal.currency,
        customerId,
        idempotencyKey: `${group.id}:${occurrenceDate}:group:debit:${loserId}`,
      });
      debits.push({ userId: loserId, paymentIntentId: pi.id });
    }

    // Credit winners evenly with pooled losers' stakes
    const totalPool = goal.stakeCents * losers.length;
    const perWinner = Math.floor(totalPool / winners.length);
    const credits = [] as { userId: string; transactionId: string }[];
    for (const winnerId of winners) {
      // For credits, we must act in the context of the winner
      // Temporarily set c.var.user to the winner to reuse ensureStripeCustomerId
      const originalUser = this.c.var.user;
      // Load winner user row to set context
      const [winnerUser] = await db
        .select()
        .from(schema.User)
        .where(eq(schema.User.id, winnerId))
        .limit(1);
      if (!winnerUser) continue;
      this.c.set("user", winnerUser);
      try {
        const tx = await this.creditCustomerBalance(
          perWinner,
          goal.currency,
          `Group ${group.id} payout ${occurrenceDate}`
        );
        credits.push({ userId: winnerId, transactionId: tx.id });
      } finally {
        // Restore original user context
        this.c.set("user", originalUser);
      }
    }

    return { winners, losers, debits, credits } as const;
  }
}
