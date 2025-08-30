import { EngineInputs, EngineOutputs, GoalState } from "../types";
import { getCurrentOccurrence } from "../occurrence";

export function baseOutput(state: GoalState): EngineOutputs {
  return {
    state,
    flags: {
      showTimer: false,
      showCheckinModal: false,
      showCheckinButton: false,
      isDurationBased: false,
    },
    labels: { timeLeft: "" },
    windows: {},
    engineVersion: "0.1.0",
  };
}

export function computeTimeLeftLabel(now: Date, target?: Date | null): string {
  if (!target) return "";
  const diff = target.getTime() - now.getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes >= 60 * 24) return `${Math.floor(minutes / (60 * 24))}d left`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h left`;
  return `${minutes}m left`;
}

export function ensureOccurrence(input: EngineInputs) {
  const occ = getCurrentOccurrence(input);
  if (!occ) return null;
  return occ;
}
