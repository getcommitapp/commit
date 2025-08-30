import { EngineInputs, EngineOutputs } from "../types";
import { baseOutput, computeTimeLeftLabel, ensureOccurrence } from "./common";

export function evaluateLocation(input: EngineInputs): EngineOutputs {
  const { now = new Date() } = input;
  const occ = ensureOccurrence(input);
  if (!occ) return baseOutput("scheduled");

  const out: EngineOutputs = {
    ...baseOutput("scheduled"),
    windows: {
      currentWindow: { kind: "location", start: occ.dueStart, end: occ.dueEnd },
    },
    labels: { timeLeft: "" },
  };

  if (now < occ.dueStart) {
    out.state = "scheduled";
    out.labels.timeLeft = computeTimeLeftLabel(now, occ.dueStart);
    out.labels.nextMilestone = "until_window";
    out.nextTransitionAt = occ.dueStart;
    return out;
  }

  if (!occ.dueEnd || now <= (occ.dueEnd as Date)) {
    out.state = "window_open";
    out.labels.timeLeft = computeTimeLeftLabel(now, occ.dueEnd ?? null);
    out.labels.nextMilestone = occ.dueEnd ? "until_due_end" : "none";
    out.nextTransitionAt = occ.dueEnd ?? undefined;
    return out;
  }

  out.state = "missed";
  return out;
}
