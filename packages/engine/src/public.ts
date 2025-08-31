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
    const base: EngineOutputs = {
      state: "passed",
      flags: {
        showTimer: false,
        showCheckinModal: false,
        showCheckinButton: false,
        isDurationBased: !!(input.goal.verificationMethod as any)
          ?.durationSeconds,
      },
      labels: { timeLeft: "" },
      windows: {},
      engineVersion: "0.1.0",
    };
    return base;
  }
  if (input.occurrenceVerification?.status === "pending") {
    return {
      state: "awaiting_verification",
      flags: {
        showTimer: false,
        showCheckinModal: false,
        showCheckinButton: false,
        isDurationBased: !!(input.goal.verificationMethod as any)
          ?.durationSeconds,
      },
      labels: { timeLeft: "" },
      windows: {},
      engineVersion: "0.1.0",
    } as const;
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
