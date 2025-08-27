import * as z from "zod";

// ---------------- Zod Schemas ----------------

export const GoalVerificationMethodSchema = z.object({
  method: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  radiusM: z.number().int().nullable().optional(),
  durationSeconds: z.number().int().nullable().optional(),
  graceTime: z.string().datetime().nullable().optional(), // ISO timestamp
});

export const GoalBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  stakeCents: z.number().int().nullable(),
  currency: z.string().nullable(),
  recurrence: z.unknown().nullable(),
  startDate: z.string().datetime().nullable(),
  endDate: z.string().datetime().nullable(),
  dueStartTime: z.string().datetime().nullable(),
  dueEndTime: z.string().datetime().nullable(),
  // could be z.enum(["dev", "charity"]).nullable() in the future
  destinationType: z.string().nullable(),
  destinationUserId: z.string().nullable(),
  destinationCharityId: z.string().nullable(),
});

export const GoalDetailsSchema = GoalBaseSchema.extend({
  verificationMethods: z.array(GoalVerificationMethodSchema),
});

export const GoalsListResponseSchema = z.array(GoalBaseSchema);

export const GoalCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  stakeCents: z.number().int().nullable().optional(),
  currency: z.string().nullable().optional(),
  recurrence: z.unknown().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  dueStartTime: z.string().datetime().nullable().optional(),
  dueEndTime: z.string().datetime().nullable().optional(),
  destinationType: z.string().nullable().optional(),
  destinationUserId: z.string().nullable().optional(),
  destinationCharityId: z.string().nullable().optional(),
});

export const GoalCreateResponseSchema = GoalBaseSchema; // Optimistic UI: return created goal

export const GoalGetResponseSchema = GoalDetailsSchema;

export const GoalDeleteResponseSchema = z.object({
  message: z.string(), // "Goal deleted successfully."
});

export const GoalVerificationInputSchema = z.object({
  type: z.string(),
  photoUrl: z.string().nullable().optional(),
  photoDescription: z.string().nullable().optional(),
  startTime: z.string().datetime().nullable().optional(), // ISO timestamp
});

export const GoalVerifyRequestSchema = z.array(GoalVerificationInputSchema);

export const GoalVerifyResponseSchema = z.object({
  message: z.string(), // "Verification log submitted."
});

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type GoalVerificationMethod = z.infer<typeof GoalVerificationMethodSchema>;

export type GoalBase = z.infer<typeof GoalBaseSchema>;

export type GoalDetails = z.infer<typeof GoalDetailsSchema>;

export type GoalsListResponse = z.infer<typeof GoalsListResponseSchema>;

export type GoalCreateRequest = z.infer<typeof GoalCreateRequestSchema>;

export type GoalCreateResponse = z.infer<typeof GoalCreateResponseSchema>;

export type GoalGetResponse = z.infer<typeof GoalGetResponseSchema>;

export type GoalDeleteResponse = z.infer<typeof GoalDeleteResponseSchema>;

export type GoalVerificationInput = z.infer<typeof GoalVerificationInputSchema>;

export type GoalVerifyRequest = z.infer<typeof GoalVerifyRequestSchema>;

export type GoalVerifyResponse = z.infer<typeof GoalVerifyResponseSchema>;
