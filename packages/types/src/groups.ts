import type { GoalDetails, GoalVerificationInput } from "./goals";

export interface GroupSummary {
  id: string;
  name: string;
  description: string | null;
  goalId: string | null;
  inviteCode: string;
}

export interface GroupMember {
  userId: string;
  status: string;
  joinedAt: string; // ISO timestamp
}

export interface GroupDetails extends GroupSummary {
  creatorId: string;
  members: GroupMember[];
}

export type GroupsListResponse = GroupSummary[];

export interface GroupCreateRequest {
  name: string;
  description?: string | null;
}

// Optimistic UI: return created group
export interface GroupCreateResponse extends GroupSummary {}

export type GroupGetResponse = GroupDetails;

export interface GroupInviteGetResponse {
  inviteCode: string;
}

export interface GroupInviteVerifyRequestQuery {
  code: string;
}

export interface GroupInviteVerifyResponse {
  valid: boolean;
}

export type GroupGoalGetResponse = GoalDetails;

export type GroupGoalVerifyRequest = GoalVerificationInput[];

export interface GroupGoalVerifyResponse {
  message: string; // "Verification log submitted."
}

export interface GroupLeaveResponse {
  message: string; // "Left group successfully."
}
