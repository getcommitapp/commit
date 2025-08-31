import { EngineInputs, EngineOutputs, GoalState } from "../types";
import { getCurrentOccurrence } from "../occurrence";

export function baseOutput(state: GoalState): EngineOutputs {
  return {
    state,
    actions: [],
  };
}

export function ensureOccurrence(input: EngineInputs) {
  const occ = getCurrentOccurrence(input);
  if (!occ) return null;
  return occ;
}
