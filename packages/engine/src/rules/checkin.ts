import { EngineInputs, EngineOutputs } from "../types";
import { baseOutput, computeTimeLeftLabel, ensureOccurrence } from "./common";

export function evaluateCheckin(input: EngineInputs): EngineOutputs {
  const { goal, now = new Date() } = input;
  const occ = ensureOccurrence(input);
  if (!occ) return baseOutput("scheduled");

  const graceSec = (goal.verificationMethod as any)?.graceTimeSeconds ?? 60;
  const inWindowNoEnd = !occ.dueEnd;
  const windowStart = occ.dueStart;
  const windowEnd = inWindowNoEnd
    ? new Date(occ.dueStart.getTime() + graceSec * 1000)
    : (occ.dueEnd as Date);

  const out: EngineOutputs = {
    ...baseOutput("scheduled"),
    windows: {
      currentWindow: { kind: "checkin", start: windowStart, end: windowEnd },
    },
    labels: { timeLeft: "" },
  };

  if (now < windowStart) {
    out.state = "scheduled";
    out.labels.timeLeft = computeTimeLeftLabel(now, windowStart);
    out.labels.nextMilestone = "until_window";
    out.nextTransitionAt = windowStart;
    out.flags.showCheckinModal = false;
    out.flags.showCheckinButton = false;
    return out;
  }

  if (now >= windowStart && now <= windowEnd) {
    out.state = "window_open";
    out.labels.timeLeft = computeTimeLeftLabel(now, windowEnd);
    out.labels.nextMilestone = "until_due_end";
    out.nextTransitionAt = windowEnd;
    if (inWindowNoEnd) {
      out.flags.showCheckinModal = true;
    } else {
      out.flags.showCheckinButton = true;
    }
    return out;
  }

  out.state = "missed";
  out.labels.timeLeft = "";
  out.labels.nextMilestone = "none";
  return out;
}
