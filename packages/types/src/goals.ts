import * as z from "zod";

// ---------------- Zod Schemas ----------------

export const GoalBaseSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  dueStartTime: z.string().datetime(),
  dueEndTime: z.string().datetime().nullable(),
  // Recurring weekly window using local wall times + bitmask
  localDueStart: z.string().nullable().optional(), // HH:mm
  localDueEnd: z.string().nullable().optional(), // HH:mm
  recDaysMask: z.number().int().nullable().optional(),

  // One method per goal with inline configuration
  method: z.enum(["location", "movement", "photo", "checkin"]),
  graceTimeSeconds: z.number().int().nullable().optional(),
  durationSeconds: z.number().int().nullable().optional(),
  geoLat: z.number().nullable().optional(),
  geoLng: z.number().nullable().optional(),
  geoRadiusM: z.number().int().nullable().optional(),

  // Stake is required (no default at type level)
  stakeCents: z.number().int(),
  currency: z.string(),
  destinationType: z.string(),
  destinationUserId: z.string().nullable(),
  destinationCharityId: z.string().nullable(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Computed fields on read
  state: z
    .enum([
      "scheduled",
      "window_open",
      "ongoing",
      "awaiting_verification",
      "missed",
      "failed",
      "passed",
      "expired",
    ])
    .optional(),
  occurrence: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime().nullable().optional(),
      latestStart: z.string().datetime().nullable().optional(),
      graceUntil: z.string().datetime().nullable().optional(),
      // Movement timer persistence
      timerStartedAt: z.string().datetime().nullable().optional(),
      timerEndedAt: z.string().datetime().nullable().optional(),
    })
    .nullable()
    .optional(),
  actions: z
    .array(
      z.object({
        kind: z.enum([
          "checkin",
          "upload_photo",
          "movement_start",
          "open_location",
        ]),
        presentation: z.enum(["button", "modal"]),
        visibleFrom: z.string().datetime(),
        visibleUntil: z.string().datetime().nullable().optional(),
        enabled: z.boolean(),
        reasonDisabled: z.string().optional(),
        label: z.string().optional(),
      })
    )
    .optional(),
  nextTransitionAt: z.string().datetime().nullable().optional(),
});

export const GoalsListItemSchema = GoalBaseSchema.extend({
  groupId: z.string().nullable().optional(),
});

export const GoalsListResponseSchema = z.array(GoalsListItemSchema);

export const GoalCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  stakeCents: z.number().int().min(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  // Single-window instants (optional when using weekly recurrence)
  dueStartTime: z.string().datetime().optional(),
  dueEndTime: z.string().datetime().nullable().optional(),
  // Weekly recurrence (optional): local times + bitmask
  localDueStart: z.string().nullable().optional(),
  localDueEnd: z.string().nullable().optional(),
  recDaysMask: z.number().int().nullable().optional(),
  // Method configuration inline
  method: z.enum(["location", "movement", "photo", "checkin"]),
  graceTimeSeconds: z.number().int().nullable().optional(),
  durationSeconds: z.number().int().nullable().optional(),
  geoLat: z.number().nullable().optional(),
  geoLng: z.number().nullable().optional(),
  geoRadiusM: z.number().int().nullable().optional(),
  // Destination
  destinationType: z.string(),
  destinationUserId: z.string().nullable().optional(),
  destinationCharityId: z.string().nullable().optional(),
});

export const GoalCreateResponseSchema = GoalBaseSchema;
export const GoalDeleteResponseSchema = z.object({
  message: z.string(), // "Goal deleted successfully."
});

export const GoalOccurrenceSchema = z.object({
  goalId: z.string(),
  userId: z.string(),
  occurrenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending", "approved", "rejected"]),
  verifiedAt: z.string().datetime().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  timerStartedAt: z.string().datetime().nullable().optional(),
  timerEndedAt: z.string().datetime().nullable().optional(),
  violated: z.boolean().nullable().optional(),
  approvedBy: z.string().nullable().optional(),
});

// -------- Action Endpoints (new model) --------

export const GoalCheckinRequestSchema = z.object({
  occurrenceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

export const GoalPhotoRequestSchema = z.object({
  photoUrl: z.string(),
  occurrenceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

export const GoalMovementStartRequestSchema = z.object({
  occurrenceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

export const GoalMovementStopRequestSchema = z.object({
  occurrenceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

export const GoalActionResponseSchema = z.object({
  state: z.enum([
    "scheduled",
    "window_open",
    "ongoing",
    "awaiting_verification",
    "missed",
    "failed",
    "passed",
    "expired",
  ]),
  occurrence: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime().nullable().optional(),
      latestStart: z.string().datetime().nullable().optional(),
      graceUntil: z.string().datetime().nullable().optional(),
      // Movement timer persistence
      timerStartedAt: z.string().datetime().nullable().optional(),
      timerEndedAt: z.string().datetime().nullable().optional(),
    })
    .nullable()
    .optional(),
  actions: z
    .array(
      z.object({
        kind: z.enum([
          "checkin",
          "upload_photo",
          "movement_start",
          "open_location",
        ]),
        presentation: z.enum(["button", "modal"]),
        visibleFrom: z.string().datetime(),
        visibleUntil: z.string().datetime().nullable().optional(),
        enabled: z.boolean(),
        reasonDisabled: z.string().optional(),
        label: z.string().optional(),
      })
    )
    .optional(),
  nextTransitionAt: z.string().datetime().nullable().optional(),
});

export const GoalReviewDetails = z.object({
  goalId: z.string(),
  userId: z.string(),
  occurrenceDate: z.string(),
  goalName: z.string(),
  goalDescription: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
});

export const GoalReviewListResponseSchema = z.array(GoalReviewDetails);

export const GoalReviewUpdateRequestSchema = z.object({
  goalId: z.string(),
  userId: z.string(),
  occurrenceDate: z.string(),
  approvalStatus: z.enum(["approved", "rejected"]),
});

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type GoalBase = z.infer<typeof GoalBaseSchema>;

export type GoalsListItem = z.infer<typeof GoalsListItemSchema>;
export type GoalsListResponse = z.infer<typeof GoalsListResponseSchema>;

export type GoalCreateRequest = z.infer<typeof GoalCreateRequestSchema>;
export type GoalCreateResponse = z.infer<typeof GoalCreateResponseSchema>;

export type GoalDeleteResponse = z.infer<typeof GoalDeleteResponseSchema>;

export type GoalOccurrence = z.infer<typeof GoalOccurrenceSchema>;

export type GoalCheckinRequest = z.infer<typeof GoalCheckinRequestSchema>;
export type GoalPhotoRequest = z.infer<typeof GoalPhotoRequestSchema>;
export type GoalMovementStartRequest = z.infer<
  typeof GoalMovementStartRequestSchema
>;
export type GoalMovementStopRequest = z.infer<
  typeof GoalMovementStopRequestSchema
>;
export type GoalActionResponse = z.infer<typeof GoalActionResponseSchema>;

export type GoalReviewListResponse = z.infer<
  typeof GoalReviewListResponseSchema
>;
export type GoalReviewUpdateRequest = z.infer<
  typeof GoalReviewUpdateRequestSchema
>;
