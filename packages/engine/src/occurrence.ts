import { formatLocalDate, formatLocalTimeHHmm, fromLocalParts } from "./tz";
import { EngineInputs, GoalCore, Occurrence } from "./types";

function pickTodayOrNext(
  goal: GoalCore,
  tz: string,
  now: Date
): Occurrence | null {
  // Single goal path: use calendar startDate combined with due time-of-day
  if (!goal.recurrence) {
    // Determine local calendar date for the occurrence
    const localDate = goal.startDate
      ? formatLocalDate(new Date(goal.startDate), tz)
      : null;

    // Determine local time-of-day strings (prefer explicit local fields)
    const localStartHHmm = goal.localDueStart
      ? goal.localDueStart
      : goal.dueStartTime
        ? formatLocalTimeHHmm(new Date(goal.dueStartTime), tz)
        : null;

    const localEndHHmm = goal.localDueEnd
      ? goal.localDueEnd
      : goal.dueEndTime
        ? formatLocalTimeHHmm(new Date(goal.dueEndTime), tz)
        : null;

    // If we have a calendar date and a start time, build the occurrence from local parts
    if (localDate && localStartHHmm) {
      const dueStart = fromLocalParts(localDate, localStartHHmm, tz);
      const dueEnd = localEndHHmm
        ? fromLocalParts(localDate, localEndHHmm, tz)
        : null;
      return {
        date: localDate,
        dueStart,
        dueEnd: dueEnd ?? undefined,
      };
    }

    // Fallback to previous absolute behavior if startDate or due times are missing
    if (goal.dueStartTime) {
      const dueStart = new Date(goal.dueStartTime);
      const dueEnd = goal.dueEndTime ? new Date(goal.dueEndTime) : null;
      return {
        date: formatLocalDate(dueStart, tz),
        dueStart,
        dueEnd: dueEnd ?? undefined,
      };
    }

    return null;
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
