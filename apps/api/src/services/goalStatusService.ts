import { computeGoalState, EngineOutputs, Recurrence } from "@commit/engine";
import { GoalSelect, UserSelect } from "../db/schema";

/*
  TODO (later):
  - Integrate payments using the occurrence action ledger for idempotency:
    1) Insert ledger row (action='debit', status='pending', unique idempotencyKey) before charging.
    2) Charge via Stripe; on success mark 'succeeded' with processedAt; on failure mark 'failed' with error.
    3) Use buildOccurrenceKey(goalId, occurrenceDate) for the idempotency key.
  - Add a periodic cron sweeper to finalize missed occurrences and trigger debits using the same idempotent flow.
*/

export type GoalStatus =
  | "scheduled"
  | "window_open"
  | "ongoing"
  | "missed"
  | "failed"
  | "passed";

export interface StatusResult {
  status: GoalStatus;
  occurrenceDate?: string | null;
  nextTransitionAt?: Date;
  engine: EngineOutputs;
}

export function evaluateGoalStatus(
  goal: GoalSelect,
  user: UserSelect
): StatusResult {
  const tz = user.timezone || "UTC";
  const engine = computeGoalState({
    tz,
    goal: {
      id: goal.id,
      startDate: new Date(goal.startDate).toISOString(),
      endDate: goal.endDate ? new Date(goal.endDate).toISOString() : null,
      dueStartTime: new Date(goal.dueStartTime).toISOString(),
      dueEndTime: goal.dueEndTime
        ? new Date(goal.dueEndTime).toISOString()
        : null,
      localDueStart: goal.localDueStart ?? null,
      localDueEnd: goal.localDueEnd ?? null,
      verificationMethod: null,
      recurrence: (goal.recurrence as Recurrence) ?? null,
    },
  });
  // Map engine states to coarse-grained status used by backend policies
  let status: GoalStatus = "scheduled";
  switch (engine.state) {
    case "scheduled":
    case "awaiting_verification":
      status = "scheduled";
      break;
    case "window_open":
      status = "window_open";
      break;
    case "ongoing":
      status = "ongoing";
      break;
    case "missed":
      status = "missed";
      break;
    case "passed":
      status = "passed";
      break;
    case "failed":
      status = "failed";
      break;
  }
  // occurrenceDate is derived on demand by clients when needed; backend can add later
  return {
    status,
    nextTransitionAt: engine.nextTransitionAt,
    engine,
  };
}

export function buildOccurrenceKey(goalId: string, occurrenceDate: string) {
  return `${goalId}:${occurrenceDate}:debit`;
}
