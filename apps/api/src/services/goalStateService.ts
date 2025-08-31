import {
  computeGoalState,
  EngineOutputs,
  GoalState,
  Recurrence,
  VerificationMethod,
} from "@commit/engine";
import { GoalSelect, UserSelect } from "../db/schema";

/*
  TODO (later):
  - Integrate payments using the occurrence action ledger for idempotency:
    1) Insert ledger row (action='debit', status='pending', unique idempotencyKey) before charging.
    2) Charge via Stripe; on success mark 'succeeded' with processedAt; on failure mark 'failed' with error.
    3) Use buildOccurrenceKey(goalId, occurrenceDate) for the idempotency key.
  - Add a periodic cron sweeper to finalize missed occurrences and trigger debits using the same idempotent flow.
*/

export interface StateResult {
  state: GoalState;
  occurrenceDate?: string | null;
  nextTransitionAt?: Date;
  engine: EngineOutputs;
}

export function evaluateGoalState(
  goal: GoalSelect & { verificationMethod?: VerificationMethod | null },
  user: UserSelect,
  occurrenceVerification: {
    status: "pending" | "approved" | "rejected";
  } | null
): StateResult {
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
      verificationMethod: goal.verificationMethod ?? null,
      recurrence: (goal.recurrence as Recurrence) ?? null,
    },
    occurrenceVerification,
  });
  return {
    state: engine.state,
    nextTransitionAt: engine.nextTransitionAt,
    engine,
  };
}

export function buildOccurrenceKey(goalId: string, occurrenceDate: string) {
  return `${goalId}:${occurrenceDate}:debit`;
}
