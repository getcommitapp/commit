import * as z from "zod";
import { GoalBaseSchema, GoalCreateRequestSchema } from "./goals";

// ---------------- Zod Schemas ----------------

export const GroupBaseSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  inviteCode: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GroupMemberSchema = z.object({
  userId: z.string(),
  status: z.string().nullable(),
  joinedAt: z.string().datetime(),
});

export const GroupListItemSchema = GroupBaseSchema.extend({
  memberCount: z.number(),
  isOwner: z.boolean(),
  members: z.array(z.object({ name: z.string(), isOwner: z.boolean() })),
  goal: GoalBaseSchema,
});

export const GroupsListResponseSchema = z.array(GroupListItemSchema);

export const GroupCreateRequestSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  goal: GoalCreateRequestSchema,
});

// Optimistic UI: return created group
export const GroupCreateResponseSchema = GroupBaseSchema;

export const GroupInviteGetResponseSchema = z.object({
  inviteCode: z.string(),
});

export const GroupInviteVerifyRequestQuerySchema = z.object({
  code: z.string(),
});

export const GroupInviteVerifyResponseSchema = z.object({
  valid: z.boolean(),
});

export const GroupLeaveResponseSchema = z.object({
  message: z.string(), // "Left group successfully."
});

export const GroupJoinRequestSchema = z.object({ code: z.string() });

export const GroupJoinResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  inviteCode: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GroupDeleteResponseSchema = z.object({
  message: z.string(), // "Group deleted successfully."
});

// ---------------- Inferred Types (backwards-compatible names) ----------------

export type GroupBase = z.infer<typeof GroupBaseSchema>;

export type GroupMember = z.infer<typeof GroupMemberSchema>;

export type GroupListItem = z.infer<typeof GroupListItemSchema>;
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

export type GroupCreateRequest = z.infer<typeof GroupCreateRequestSchema>;

export type GroupCreateResponse = z.infer<typeof GroupCreateResponseSchema>;

export type GroupInviteGetResponse = z.infer<
  typeof GroupInviteGetResponseSchema
>;

export type GroupInviteVerifyRequestQuery = z.infer<
  typeof GroupInviteVerifyRequestQuerySchema
>;

export type GroupInviteVerifyResponse = z.infer<
  typeof GroupInviteVerifyResponseSchema
>;

export type GroupLeaveResponse = z.infer<typeof GroupLeaveResponseSchema>;

export type GroupJoinRequest = z.infer<typeof GroupJoinRequestSchema>;

export type GroupJoinResponse = z.infer<typeof GroupJoinResponseSchema>;

export type GroupDeleteResponse = z.infer<typeof GroupDeleteResponseSchema>;
