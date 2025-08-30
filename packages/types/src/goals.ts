import * as z from "zod";

// ---------------- Zod Schemas ----------------

export const GoalVerificationMethodSchema = z.object({
  id: z.string(),
  method: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  radiusM: z.number().int().nullable().optional(),
  durationSeconds: z.number().int().nullable().optional(),
  graceTimeSeconds: z.number().int().nullable().optional(),
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

export const GoalsListItemSchema = GoalBaseSchema.extend({
  verificationMethod: GoalVerificationMethodSchema.nullable().optional(),
  group: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const GoalsListResponseSchema = z.array(GoalsListItemSchema);

export const GoalCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  stakeCents: z.number().int().min(100),
  recurrence: z.string().nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  dueStartTime: z.string().datetime(),
  dueEndTime: z.string().datetime().nullable().optional(),
  destinationType: z.string(),
  destinationUserId: z.string().nullable().optional(),
  destinationCharityId: z.string().nullable().optional(),
  verificationMethod: z
    .object({
      method: z.enum(["location", "movement", "photo", "checkin"]),
      durationSeconds: z.number().int().nullable().optional(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      radiusM: z.number().int().nullable().optional(),
    })
    .optional(),
});

export const GoalCreateResponseSchema = GoalBaseSchema;
export const GoalDeleteResponseSchema = z.object({
  message: z.string(), // "Goal deleted successfully."
});

export const GoalVerificationInputSchema = z.object({
  photoUrl: z.string().nullable().optional(),
  photoDescription: z.string().nullable().optional(),
  startTime: z.string().datetime().nullable().optional(),
});

export const GoalVerifyRequestSchema = z.array(GoalVerificationInputSchema);

export const GoalVerifyResponseSchema = z.object({
  message: z.string(), // "Verification log submitted."
});

// ---------------- Goal Timer Schemas ----------------

export const GoalTimerSchema = z.object({
  goalId: z.string(),
  userId: z.string(),
  startedAt: z.string().datetime().nullable(),
});

export const GoalTimerGetResponseSchema = z.object({
  timer: GoalTimerSchema.nullable(),
});

export const GoalTimerStartResponseSchema = z.object({
  timer: GoalTimerSchema,
  created: z.boolean(),
});

export const GoalReviewDetails = z.object({
  goalId: z.string(),
  goalName: z.string(),
  photoUrl: z.string().nullable().optional(),
  photoDescription: z.string().nullable().optional(),
});

export const GoalReviewListResponseSchema = z.array(GoalReviewDetails);

export const GoalReviewUpdateRequestSchema = z.object({
  approvalStatus: z.enum(["approved", "rejected"]),
});

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type GoalVerificationMethod = z.infer<
  typeof GoalVerificationMethodSchema
>;

export type GoalBase = z.infer<typeof GoalBaseSchema>;

export type GoalsListItem = z.infer<typeof GoalsListItemSchema>;
export type GoalsListResponse = z.infer<typeof GoalsListResponseSchema>;

export type GoalCreateRequest = z.infer<typeof GoalCreateRequestSchema>;
export type GoalCreateResponse = z.infer<typeof GoalCreateResponseSchema>;

export type GoalDeleteResponse = z.infer<typeof GoalDeleteResponseSchema>;

export type GoalVerificationInput = z.infer<typeof GoalVerificationInputSchema>;
export type GoalVerifyRequest = z.infer<typeof GoalVerifyRequestSchema>;
export type GoalVerifyResponse = z.infer<typeof GoalVerifyResponseSchema>;

export type GoalTimer = z.infer<typeof GoalTimerSchema>;
export type GoalTimerGetResponse = z.infer<typeof GoalTimerGetResponseSchema>;
export type GoalTimerStartResponse = z.infer<
  typeof GoalTimerStartResponseSchema
>;

export type GoalReviewListResponse = z.infer<
  typeof GoalReviewListResponseSchema
>;
export type GoalReviewUpdateRequest = z.infer<
  typeof GoalReviewUpdateRequestSchema
>;
