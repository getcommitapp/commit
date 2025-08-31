import {
  computeGoalState,
  GoalState,
  Recurrence,
  VerificationMethod,
} from "@commit/engine";
import type {
  GoalOccurrenceSelect,
  GoalSelect,
  UserSelect,
} from "../db/schema";

export function todayLocal(tz: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz || "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\//g, "-");
}

export function maskToDays(recDaysMask?: number | null): number[] | null {
  if (!recDaysMask && recDaysMask !== 0) return null;
  const out: number[] = [];
  for (let i = 0; i < 7; i++) if (recDaysMask & (1 << i)) out.push(i + 1);
  return out.length ? out : null;
}

export function toEngineInputs(
  goal: GoalSelect,
  user: UserSelect,
  occurrence?: GoalOccurrenceSelect | null
) {
  const days = maskToDays(goal.recDaysMask ?? null);
  const recurrence: Recurrence = days
    ? { type: "weekly", daysOfWeek: days }
    : null;
  return {
    tz: user.timezone || "UTC",
    goal: {
      id: goal.id,
      startDate: goal.startDate ? new Date(goal.startDate).toISOString() : null,
      endDate: goal.endDate ? new Date(goal.endDate).toISOString() : null,
      dueStartTime: goal.dueStartTime
        ? new Date(goal.dueStartTime).toISOString()
        : null,
      dueEndTime: goal.dueEndTime
        ? new Date(goal.dueEndTime).toISOString()
        : null,
      localDueStart: goal.localDueStart ?? null,
      localDueEnd: goal.localDueEnd ?? null,
      recurrence,
      verificationMethod: ((): VerificationMethod => {
        switch (goal.method) {
          case "movement":
            return {
              method: "movement",
              durationSeconds: goal.durationSeconds ?? 0,
            };
          case "photo":
            return {
              method: "photo",
              graceTimeSeconds: goal.graceTimeSeconds ?? 60,
            };
          case "checkin":
            return {
              method: "checkin",
              graceTimeSeconds: goal.graceTimeSeconds ?? 60,
            };
          case "location":
          default:
            return { method: "location" };
        }
      })(),
    },
    occurrenceVerification: occurrence
      ? ({ status: occurrence.status } as const)
      : null,
  } as const;
}

export interface ComputedGoalState {
  state: GoalState;
  occurrence?: {
    start: string;
    end?: string | null;
    latestStart?: string | null;
    graceUntil?: string | null;
  } | null;
  actions: {
    kind: "checkin" | "upload_photo" | "movement_start" | "open_location";
    presentation: "button" | "modal";
    visibleFrom: string;
    visibleUntil?: string | null;
    enabled: boolean;
    reasonDisabled?: string;
    label?: string;
  }[];
  nextTransitionAt?: string;
}

export function computeState(
  goal: GoalSelect,
  user: UserSelect,
  occurrence?: GoalOccurrenceSelect | null
): ComputedGoalState {
  const input = toEngineInputs(goal, user, occurrence ?? null);
  const engine = computeGoalState(input);
  return {
    state: engine.state,
    occurrence: engine.occurrence
      ? {
          start: engine.occurrence.start.toISOString(),
          end: engine.occurrence.end?.toISOString() ?? null,
          latestStart: engine.occurrence.latestStart?.toISOString() ?? null,
          graceUntil: engine.occurrence.graceUntil?.toISOString() ?? null,
        }
      : null,
    actions: (engine.actions || []).map((a) => ({
      ...a,
      visibleFrom: a.visibleFrom.toISOString(),
      visibleUntil: a.visibleUntil ? a.visibleUntil.toISOString() : null,
    })),
    nextTransitionAt: engine.nextTransitionAt?.toISOString(),
  };
}
