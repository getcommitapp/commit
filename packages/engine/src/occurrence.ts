import { formatLocalDate, fromLocalParts } from "./tz";
import { EngineInputs, GoalCore, Occurrence } from "./types";

function pickTodayOrNext(
  goal: GoalCore,
  tz: string,
  now: Date
): Occurrence | null {
  // Single goal path using absolute dueStart/dueEnd
  if (!goal.recurrence) {
    if (!goal.dueStartTime) return null;
    const dueStart = new Date(goal.dueStartTime);
    const dueEnd = goal.dueEndTime ? new Date(goal.dueEndTime) : null;
    return {
      date: formatLocalDate(dueStart, tz),
      dueStart,
      dueEnd: dueEnd ?? undefined,
    };
  }

  // Recurring: compute today's occurrence if today is selected, else next selected day within 14 days
  const z = new Date(now);
  for (let i = 0; i < 14; i++) {
    const probe = new Date(z.getTime() + i * 24 * 60 * 60 * 1000);
    const localDate = formatLocalDate(probe, tz);
    const dow = new Date(fromLocalParts(localDate, "00:00", tz)).getUTCDay();
    // Map JS getUTCDay() 0..6 (Sun=0) to 1..7 (Mon=1)
    const isoDow = ((dow + 6) % 7) + 1;
    const allowed = goal.recurrence?.daysOfWeek?.includes(isoDow) ?? false;
    if (!allowed) continue;
    if (!goal.localDueStart) return null;
    const dueStart = fromLocalParts(localDate, goal.localDueStart, tz);
    const dueEnd = goal.localDueEnd
      ? fromLocalParts(localDate, goal.localDueEnd, tz)
      : null;
    return { date: localDate, dueStart, dueEnd: dueEnd ?? undefined };
  }

  return null;
}

export function getCurrentOccurrence(input: EngineInputs): Occurrence | null {
  const { goal, tz, now = new Date() } = input;
  return pickTodayOrNext(goal, tz, now);
}
