import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import Stripe from "stripe";

export class PaymentsDebitTest extends OpenAPIRoute {
  schema = {
    tags: ["Payments"],
    summary: "Test: debit 10 CHF using saved default payment method",
    responses: {
      "200": {
        description: "PaymentIntent created/confirmed",
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    const customerId = user?.stripeCustomerId;

    if (!customerId) {
      return c.json({ error: "User has no Stripe customer" }, 400);
    }

    // Retrieve the customer's default payment method if available
    const customer = await stripe.customers.retrieve(customerId);
    const invoiceSettings = (customer as Stripe.Customer).invoice_settings;
    let defaultPaymentMethodId = invoiceSettings?.default_payment_method as
      | string
      | null
      | undefined;

    // If no default payment method, try to pick the most recent attached card and set it as default
    if (!defaultPaymentMethodId) {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
        limit: 1,
      });
      const candidate = paymentMethods.data[0];
      if (candidate?.id) {
        await stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: candidate.id },
        });
        defaultPaymentMethodId = candidate.id;
      }
    }

    const amountCents = 1000; // 10 CHF

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "chf",
      customer: customerId,
      payment_method: defaultPaymentMethodId || undefined,
      confirm: !!defaultPaymentMethodId,
      off_session: !!defaultPaymentMethodId,
      automatic_payment_methods: defaultPaymentMethodId
        ? undefined
        : { enabled: true },
    });

    return c.json({ id: paymentIntent.id, status: paymentIntent.status }, 200);
  }
}
