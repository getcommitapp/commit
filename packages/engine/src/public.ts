import { EngineInputs, EngineOutputs, VerificationMethod } from "./types";
import { evaluateCheckin } from "./rules/checkin";
import { evaluatePhoto } from "./rules/photo";
import { evaluateMovement } from "./rules/movement";
import { evaluateLocation } from "./rules/location";

export function computeGoalState(input: EngineInputs): EngineOutputs {
  const method = input.goal.verificationMethod?.method as
    | VerificationMethod["method"]
    | undefined;
  // If occurrence has approved verification, short-circuit to a passed state and hide CTAs
  if (input.occurrenceVerification?.status === "approved") {
    return {
      state: "passed",
      actions: [],
    };
  }
  if (input.occurrenceVerification?.status === "pending") {
    // Surface any occurrence context (e.g., timer) so clients can render progress
    const out: EngineOutputs = {
      state: "awaiting_verification",
      actions: [],
    } as const;
    if (
      input.occurrenceContext?.timerStartedAt ||
      input.occurrenceContext?.timerEndedAt
    ) {
      out.occurrence = {
        // Use dueStart/dueEnd when available to bound the UI window
        start: input.goal.dueStartTime
          ? new Date(input.goal.dueStartTime)
          : new Date(),
        end: input.goal.dueEndTime
          ? new Date(input.goal.dueEndTime)
          : undefined,
        timerStartedAt: input.occurrenceContext?.timerStartedAt ?? null,
        timerEndedAt: input.occurrenceContext?.timerEndedAt ?? null,
      } as any;
    }
    return out;
  }
  switch (method) {
    case "checkin":
      return evaluateCheckin(input);
    case "photo":
      return evaluatePhoto(input);
    case "movement":
      return evaluateMovement(input);
    case "location":
      return evaluateLocation(input);
    default:
      // No method defined → default to checkin-like with no end and small grace
      return evaluateCheckin(input);
  }
}
