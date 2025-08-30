import { EngineInputs, EngineOutputs } from "../types";
import { baseOutput, computeTimeLeftLabel, ensureOccurrence } from "./common";

export function evaluateMovement(input: EngineInputs): EngineOutputs {
  const { goal, now = new Date() } = input;
  const occ = ensureOccurrence(input);
  if (!occ) return baseOutput("scheduled");

  const durationSec = (goal.verificationMethod as any)?.durationSeconds ?? 0;
  const windowStart = occ.dueStart;
  const out: EngineOutputs = {
    ...baseOutput("scheduled"),
    windows: {
      currentWindow: {
        kind: "duration",
        start: windowStart,
        end: occ.dueEnd ?? undefined,
      },
    },
    labels: { timeLeft: "" },
  };

  if (!occ.dueEnd) {
    // No end: must avoid motion for [start, start+duration]
    const requiredEnd = new Date(windowStart.getTime() + durationSec * 1000);
    if (now < windowStart) {
      out.state = "scheduled";
      out.labels.timeLeft = computeTimeLeftLabel(now, windowStart);
      out.labels.nextMilestone = "until_window";
      out.nextTransitionAt = windowStart;
      out.flags.isDurationBased = true;
      return out;
    }
    if (now >= windowStart && now <= requiredEnd) {
      out.state = "ongoing";
      out.flags.isDurationBased = true;
      out.labels.timeLeft = computeTimeLeftLabel(now, requiredEnd);
      out.labels.nextMilestone = "until_due_end";
      out.nextTransitionAt = requiredEnd;
      return out;
    }
    // after
    out.state = "passed"; // assuming no motion; actual failure detected externally
    out.flags.isDurationBased = true;
    return out;
  }

  // With end: can start within [start, end - duration]
  const latestStart = new Date(
    (occ.dueEnd as Date).getTime() - durationSec * 1000
  );
  out.windows.latestStart = latestStart;

  if (now < windowStart) {
    out.state = "scheduled";
    out.flags.isDurationBased = true;
    out.flags.showTimer = true;
    out.labels.timeLeft = computeTimeLeftLabel(now, windowStart);
    out.labels.nextMilestone = "until_window";
    out.nextTransitionAt = windowStart;
    return out;
  }

  if (now >= windowStart && now <= latestStart) {
    out.state = "window_open";
    out.flags.isDurationBased = true;
    out.flags.showTimer = true;
    out.labels.timeLeft = computeTimeLeftLabel(now, latestStart);
    out.labels.nextMilestone = "until_latest_start";
    out.nextTransitionAt = latestStart;
    return out;
  }

  if (now > latestStart && now <= (occ.dueEnd as Date)) {
    out.state = "missed"; // cannot start anymore
    out.flags.isDurationBased = true;
    out.flags.showTimer = false;
    out.labels.nextMilestone = "until_due_end";
    out.labels.timeLeft = computeTimeLeftLabel(now, occ.dueEnd as Date);
    out.nextTransitionAt = occ.dueEnd as Date;
    return out;
  }

  out.state = "missed";
  out.flags.isDurationBased = true;
  return out;
}
