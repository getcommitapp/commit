import * as z from "zod";

// ---------------- Zod Schemas ----------------

export const GoalVerificationMethodSchema = z.object({
  id: z.string(),
  method: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  radiusM: z.number().int().nullable().optional(),
  durationSeconds: z.number().int().nullable().optional(),
  graceTime: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GoalBaseSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  dueStartTime: z.string().datetime(),
  dueEndTime: z.string().datetime().nullable(),
  recurrence: z.string().nullable(),
  stakeCents: z.number().int(),
  currency: z.string(),
  destinationType: z.string(),
  destinationUserId: z.string().nullable(),
  destinationCharityId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GoalDetailsSchema = GoalBaseSchema.extend({
  verificationMethods: z.array(GoalVerificationMethodSchema),
});

export const GoalsListResponseSchema = z.array(GoalBaseSchema);

export const GoalCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  stakeCents: z.number().int(),
  currency: z.string(),
  recurrence: z.string().nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  dueStartTime: z.string().datetime(),
  dueEndTime: z.string().datetime().nullable().optional(),
  destinationType: z.string(),
  destinationUserId: z.string().nullable().optional(),
  destinationCharityId: z.string().nullable().optional(),
});

export const GoalCreateResponseSchema = GoalBaseSchema;
export const GoalGetResponseSchema = GoalDetailsSchema;
export const GoalDeleteResponseSchema = z.object({
  message: z.string(), // "Goal deleted successfully."
});

export const GoalVerificationInputSchema = z.object({
  type: z.string(),
  photoUrl: z.string().nullable().optional(),
  photoDescription: z.string().nullable().optional(),
  startTime: z.string().datetime().nullable().optional(),
});

export const GoalVerifyRequestSchema = z.array(GoalVerificationInputSchema);

export const GoalVerifyResponseSchema = z.object({
  message: z.string(), // "Verification log submitted."
});

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type GoalVerificationMethod = z.infer<
  typeof GoalVerificationMethodSchema
>;

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
