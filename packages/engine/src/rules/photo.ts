import { EngineInputs, EngineOutputs } from "../types";
import { baseOutput, ensureOccurrence } from "./common";

export function evaluatePhoto(input: EngineInputs): EngineOutputs {
  const { goal, now = new Date() } = input;
  // Approved/pending handled in public.ts
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
    occurrence: {
      start: windowStart,
      end: windowEnd,
      graceUntil: inWindowNoEnd ? windowEnd : undefined,
    },
    actions: [
      {
        kind: "upload_photo",
        presentation: inWindowNoEnd ? "modal" : "button",
        visibleFrom: windowStart,
        visibleUntil: windowEnd,
        enabled: now >= windowStart && now <= windowEnd,
        label: "Upload photo",
      },
    ],
  };

  if (now < windowStart) {
    out.state = "scheduled";
    out.nextTransitionAt = windowStart;
    return out;
  }

  if (now >= windowStart && now <= windowEnd) {
    out.state = "window_open";
    out.nextTransitionAt = windowEnd;
    return out;
  }

  // If explicitly rejected and window ended, mark failed; else missed
  if (input.occurrenceVerification?.status === "rejected") {
    out.state = "failed";
  } else {
    out.state = "missed";
  }
  return out;
}
