import * as z from "zod";
import { GoalDetailsSchema, GoalVerificationInputSchema } from "./goals";

// ---------------- Zod Schemas ----------------

export const GroupSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  goalId: z.string().nullable(),
  inviteCode: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  memberCount: z.number().optional(),
  goal: GoalDetailsSchema,
});

export const GroupMemberSchema = z.object({
  userId: z.string(),
  status: z.string().nullable(),
  joinedAt: z.string().datetime(),
});

export const GroupDetailsSchema = GroupSummarySchema.extend({
  creatorId: z.string(),
  members: z.array(GroupMemberSchema),
});

export const GroupsListResponseSchema = z.array(GroupSummarySchema);

export const GroupCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

// Optimistic UI: return created group
export const GroupCreateResponseSchema = GroupSummarySchema;

export const GroupGetResponseSchema = GroupDetailsSchema;

export const GroupInviteGetResponseSchema = z.object({
  inviteCode: z.string(),
});

export const GroupInviteVerifyRequestQuerySchema = z.object({
  code: z.string(),
});

export const GroupInviteVerifyResponseSchema = z.object({
  valid: z.boolean(),
});

export const GroupGoalGetResponseSchema = GoalDetailsSchema;

export const GroupGoalVerifyRequestSchema = z.array(
  GoalVerificationInputSchema
);

export const GroupGoalVerifyResponseSchema = z.object({
  message: z.string(), // "Verification log submitted."
});

export const GroupLeaveResponseSchema = z.object({
  message: z.string(), // "Left group successfully."
});

export const GroupJoinRequestSchema = z.object({ code: z.string() });

export const GroupJoinResponseSchema = GroupSummarySchema;

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type GroupSummary = z.infer<typeof GroupSummarySchema>;

export type GroupMember = z.infer<typeof GroupMemberSchema>;

export type GroupDetails = z.infer<typeof GroupDetailsSchema>;

export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

export type GroupCreateRequest = z.infer<typeof GroupCreateRequestSchema>;

export type GroupCreateResponse = z.infer<typeof GroupCreateResponseSchema>;

export type GroupGetResponse = z.infer<typeof GroupGetResponseSchema>;

export type GroupInviteGetResponse = z.infer<
  typeof GroupInviteGetResponseSchema
>;

export type GroupInviteVerifyRequestQuery = z.infer<
  typeof GroupInviteVerifyRequestQuerySchema
>;

export type GroupInviteVerifyResponse = z.infer<
  typeof GroupInviteVerifyResponseSchema
>;

export type GroupGoalGetResponse = z.infer<typeof GroupGoalGetResponseSchema>;

export type GroupGoalVerifyRequest = z.infer<
  typeof GroupGoalVerifyRequestSchema
>;

export type GroupGoalVerifyResponse = z.infer<
  typeof GroupGoalVerifyResponseSchema
>;

export type GroupLeaveResponse = z.infer<typeof GroupLeaveResponseSchema>;

export type GroupJoinRequest = z.infer<typeof GroupJoinRequestSchema>;

export type GroupJoinResponse = z.infer<typeof GroupJoinResponseSchema>;
