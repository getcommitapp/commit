import { EngineInputs, EngineOutputs, VerificationMethod } from "./types";
import { evaluateCheckin } from "./rules/checkin";
import { evaluatePhoto } from "./rules/photo";
import { evaluateMovement } from "./rules/movement";
import { evaluateLocation } from "./rules/location";

export function computeGoalState(input: EngineInputs): EngineOutputs {
  const method = input.goal.verificationMethod?.method as
    | VerificationMethod["method"]
    | undefined;
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
