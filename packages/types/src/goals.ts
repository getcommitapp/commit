export interface GoalVerificationMethod {
  method: string;
  latitude?: number | null;
  longitude?: number | null;
  radiusM?: number | null;
  durationSeconds?: number | null;
  graceTime?: string | null; // ISO timestamp
}

export interface GoalBase {
  id: string;
  name: string;
  description: string | null;
  stakeCents: number | null;
  currency: string | null;
  recurrence: unknown | null;
  startDate: string | null;
  endDate: string | null;
  dueStartTime: string | null;
  dueEndTime: string | null;
  destinationType: string | null; // "dev" | "charity"
  destinationUserId: string | null;
  destinationCharityId: string | null;
}

export interface GoalDetails extends GoalBase {
  verificationMethods: GoalVerificationMethod[];
}

export type GoalsListResponse = GoalBase[];

export interface GoalCreateRequest {
  name: string;
  description?: string | null;
  stakeCents?: number | null;
  currency?: string | null;
  recurrence?: unknown | null;
  startDate?: string | null;
  endDate?: string | null;
  dueStartTime?: string | null;
  dueEndTime?: string | null;
  destinationType?: string | null;
  destinationUserId?: string | null;
  destinationCharityId?: string | null;
}

// Optimistic UI: return created goal
export type GoalCreateResponse = GoalBase;

export type GoalGetResponse = GoalDetails;

export interface GoalDeleteResponse {
  message: string; // "Goal deleted successfully."
}

export interface GoalVerificationInput {
  type: string;
  photoUrl?: string | null;
  photoDescription?: string | null;
  startTime?: string | null; // ISO timestamp
}

export type GoalVerifyRequest = GoalVerificationInput[];

export interface GoalVerifyResponse {
  message: string; // "Verification log submitted."
}
