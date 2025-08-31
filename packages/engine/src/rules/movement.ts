import { EngineInputs, EngineOutputs } from "../types";
import { baseOutput, ensureOccurrence } from "./common";

export function evaluateMovement(input: EngineInputs): EngineOutputs {
  const { goal, now = new Date() } = input;
  const occ = ensureOccurrence(input);
  if (!occ) return baseOutput("scheduled");

  const durationSec = (goal.verificationMethod as any)?.durationSeconds ?? 0;
  const windowStart = occ.dueStart;
  const out: EngineOutputs = {
    ...baseOutput("scheduled"),
    occurrence: {
      start: windowStart,
      end: occ.dueEnd ?? undefined,
    },
    actions: [],
  };

  if (!occ.dueEnd) {
    // No end: must avoid motion for [start, start+duration]
    const requiredEnd = new Date(windowStart.getTime() + durationSec * 1000);
    if (now < windowStart) {
      out.state = "scheduled";
      out.nextTransitionAt = windowStart;
      return out;
    }
    if (now >= windowStart && now <= requiredEnd) {
      out.state = "ongoing";
      out.nextTransitionAt = requiredEnd;
      return out;
    }
    // after
    out.state = "passed"; // assuming no motion; actual failure detected externally
    return out;
  }

  // With end: can start within [start, end - duration]
  const latestStart = new Date(
    (occ.dueEnd as Date).getTime() - durationSec * 1000
  );
  out.occurrence = { ...(out.occurrence as any), latestStart } as any;

  if (now < windowStart) {
    out.state = "scheduled";
    out.nextTransitionAt = windowStart;
    out.actions = [
      {
        kind: "movement_start",
        presentation: "button",
        visibleFrom: windowStart,
        visibleUntil: latestStart,
        enabled: false,
        label: "Start timer",
      },
    ];
    return out;
  }

  if (now >= windowStart && now <= latestStart) {
    out.state = "window_open";
    out.nextTransitionAt = latestStart;
    out.actions = [
      {
        kind: "movement_start",
        presentation: "button",
        visibleFrom: windowStart,
        visibleUntil: latestStart,
        enabled: true,
        label: "Start timer",
      },
    ];
    return out;
  }

  if (now > latestStart && now <= (occ.dueEnd as Date)) {
    out.state = "missed"; // cannot start anymore
    out.nextTransitionAt = occ.dueEnd as Date;
    return out;
  }

  out.state = "missed";
  return out;
}
