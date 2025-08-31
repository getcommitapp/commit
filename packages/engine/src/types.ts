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
  flags: {
    showTimer: boolean;
    showCheckinModal: boolean;
    showCheckinButton: boolean;
    isDurationBased: boolean;
  };
  labels: {
    timeLeft: string;
    nextMilestone?:
      | "until_start"
      | "until_window"
      | "until_latest_start"
      | "until_due_end"
      | "none";
  };
  windows: {
    currentWindow?: {
      kind: "duration" | "checkin" | "photo" | "location";
      start: Date;
      end?: Date;
    };
    latestStart?: Date;
    graceUntil?: Date;
  };
  nextTransitionAt?: Date;
  engineVersion: string;
  reasons?: string[];
}

export interface Occurrence {
  date: string; // YYYY-MM-DD in local tz
  dueStart: Date; // instant
  dueEnd?: Date | null; // instant
}
