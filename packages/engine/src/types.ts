export type VerificationMethodType =
  | "location"
  | "photo"
  | "checkin"
  | "movement";

export interface VerificationMethodBase {
  method: VerificationMethodType;
}

export interface PhotoVerificationMethod extends VerificationMethodBase {
  method: "photo";
  graceTimeSeconds?: number | null;
}

export interface CheckinVerificationMethod extends VerificationMethodBase {
  method: "checkin";
  graceTimeSeconds?: number | null;
}

export interface MovementVerificationMethod extends VerificationMethodBase {
  method: "movement";
  durationSeconds: number; // required for movement
}

export interface LocationVerificationMethod extends VerificationMethodBase {
  method: "location";
  // Placeholder for future fields like radius, lat/lng, etc.
}

export type VerificationMethod =
  | PhotoVerificationMethod
  | CheckinVerificationMethod
  | MovementVerificationMethod
  | LocationVerificationMethod;

export interface RecurrenceWeekly {
  type: "weekly";
  daysOfWeek: number[]; // 1=Mon ... 7=Sun, local TZ
}

export type Recurrence = RecurrenceWeekly | null;

export interface GoalCore {
  id: string;
  startDate?: string | null; // ISO UTC instant
  endDate?: string | null; // ISO UTC instant
  dueStartTime?: string | null; // ISO UTC instant for single goals OR next occurrence
  dueEndTime?: string | null; // ISO UTC instant or null
  // For recurring goals, prefer local time-of-day strings
  localDueStart?: string | null; // "HH:mm"
  localDueEnd?: string | null; // "HH:mm" or null
  recurrence?: Recurrence; // null for single goal
  verificationMethod?: VerificationMethod | null;
}

export interface EngineInputs {
  goal: GoalCore;
  tz: string; // IANA
  now?: Date;
  // Verification state for the current occurrence (per-user context)
  occurrenceVerification: {
    status: "pending" | "approved" | "rejected";
    submittedAt?: Date;
  } | null;
  // Additional per-occurrence context that the engine can surface
  occurrenceContext?: {
    timerStartedAt?: Date | null;
    timerEndedAt?: Date | null;
  } | null;
}

export type GoalState =
  | "scheduled"
  | "window_open"
  | "ongoing"
  | "awaiting_verification"
  | "passed"
  | "missed"
  | "failed"
  | "expired";

export interface EngineOutputs {
  state: GoalState;
  occurrence?: {
    start: Date;
    end?: Date;
    latestStart?: Date;
    graceUntil?: Date;
    // surfaced context for duration-capable methods (e.g., movement/location)
    timerStartedAt?: Date | null;
    timerEndedAt?: Date | null;
  };
  actions: Action[];
  nextTransitionAt?: Date;
  reasons?: string[];
}

export interface Occurrence {
  date: string; // YYYY-MM-DD in local tz
  dueStart: Date; // instant
  dueEnd?: Date | null; // instant
}

export type ActionKind =
  | "checkin"
  | "upload_photo"
  | "movement_start"
  | "open_location";

export interface Action {
  kind: ActionKind;
  presentation: "button" | "modal";
  visibleFrom: Date;
  visibleUntil?: Date;
  enabled: boolean;
  reasonDisabled?: string;
  label?: string;
}
