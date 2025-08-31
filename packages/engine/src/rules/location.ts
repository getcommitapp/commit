import { EngineInputs, EngineOutputs } from "../types";
import { baseOutput, ensureOccurrence } from "./common";

export function evaluateLocation(input: EngineInputs): EngineOutputs {
  const { now = new Date() } = input;
  const occ = ensureOccurrence(input);
  if (!occ) return baseOutput("scheduled");

  const out: EngineOutputs = {
    ...baseOutput("scheduled"),
    occurrence: {
      start: occ.dueStart,
      end: occ.dueEnd ?? undefined,
    },
    actions: [
      {
        kind: "open_location",
        presentation: "button",
        visibleFrom: occ.dueStart,
        visibleUntil: occ.dueEnd ?? undefined,
        enabled: now >= occ.dueStart && (!occ.dueEnd || now <= (occ.dueEnd as Date)),
        label: "Open location",
      },
    ],
  };

  if (now < occ.dueStart) {
    out.state = "scheduled";
    out.nextTransitionAt = occ.dueStart;
    return out;
  }

  if (!occ.dueEnd || now <= (occ.dueEnd as Date)) {
    out.state = "window_open";
    out.nextTransitionAt = occ.dueEnd ?? undefined;
    return out;
  }

  out.state = "missed";
  return out;
}
