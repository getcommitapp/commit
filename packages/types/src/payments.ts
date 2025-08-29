import { z } from "zod";

export const PaymentsSetupIntentResponseSchema = z.object({
  clientSecret: z.string(),
});
export type PaymentsSetupIntentResponse = z.infer<
  typeof PaymentsSetupIntentResponseSchema
>;

export const PaymentsChargeRequestSchema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.string().min(1),
  paymentMethodId: z.string().min(1).optional(),
  customerId: z.string().min(1).optional(),
  idempotencyKey: z.string().min(1).optional(),
});
export type PaymentsChargeRequest = z.infer<typeof PaymentsChargeRequestSchema>;

export const PaymentsChargeResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
});
export type PaymentsChargeResponse = z.infer<
  typeof PaymentsChargeResponseSchema
>;

export const PaymentsRefundRequestSchema = z.object({
  paymentIntentId: z.string(),
  amountCents: z.number().int().positive().optional(),
});
export type PaymentsRefundRequest = z.infer<typeof PaymentsRefundRequestSchema>;

export const PaymentsRefundResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
});
export type PaymentsRefundResponse = z.infer<
  typeof PaymentsRefundResponseSchema
>;

export const PaymentsMethodResponseSchema = z.object({
  status: z.enum(["active", "inactive"]).default("inactive"),
  method: z
    .object({
      brand: z.string().optional(),
      last4: z.string().optional(),
      expMonth: z.number().optional(),
      expYear: z.number().optional(),
    })
    .nullable()
    .optional(),
});
export type PaymentsMethodResponse = z.infer<
  typeof PaymentsMethodResponseSchema
>;
