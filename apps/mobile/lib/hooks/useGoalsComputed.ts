/**
 * useGoalsComputed
 *
 * Computes two derived, time-sensitive properties for an array of goals and
 * refreshes them locally every minute (no network calls):
 *
 * - timeLeft: A user-facing label indicating the next relevant time milestone.
 *   Logic:
 *     - If now < startDate: show time until startDate.
 *     - Else if now < dueStartTime: show time until dueStartTime.
 *     - Else if the goal has a duration-based verification AND dueEndTime is set:
 *         - Let duration = verificationMethod.durationSeconds.
 *         - Let latestStart = dueEndTime - duration.
 *         - If dueStartTime <= now <= latestStart: show "Ongoing".
 *         - Else: show "Overdue".
 *     - Else (no duration window): show "Overdue".
 *
 * - showTimer: Whether the "Start Timer" CTAs should be visible.
 *   Logic (only for duration-based verification and when dueEndTime exists):
 *     - Let latestStart = dueEndTime - duration.
 *     - Return true when dueStartTime <= now <= latestStart.
 *     - Return false otherwise (including when dueEndTime is missing or duration <= 0).
 *
 * - Check-in method support (method === "checkin"):
 *   - If no dueEndTime: when now is within [dueStartTime, dueStartTime + graceTime]
 *     then show a one-shot check-in modal (showCheckinModal = true). Otherwise, it's missed.
 *   - If dueEndTime exists: show a persistent "Check-in" button (showCheckinButton = true)
 *     during [dueStartTime, dueEndTime].
 *
 * Notes:
 * - Raw timestamps (startDate, dueStartTime, dueEndTime) are kept on goal objects.
 * - Formatted fields are appended alongside as ...Formatted for UI display.
 * - We intentionally do not auto-refetch from the network; values are recomputed
 *   locally once per minute using setTimeout.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { GoalsListItem } from "@commit/types";

function isDurationBasedVerification(
  verificationMethod: GoalsListItem["verificationMethod"] | undefined | null
): boolean {
  const durationSeconds = verificationMethod?.durationSeconds;
  return typeof durationSeconds === "number" && durationSeconds > 0;
}

type InputGoal = Pick<
  GoalsListItem,
  "id" | "startDate" | "dueStartTime" | "dueEndTime" | "verificationMethod"
>;

function formatDiff(diffMs: number): string {
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d left`;
  if (diffHours > 0) return `${diffHours}h left`;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes}m left`;
}

function computeTimeLeft(goal: InputGoal): string {
  const startDate = goal.startDate;
  const dueStartTime = goal.dueStartTime;
  const dueEndTime = goal.dueEndTime;
  const durationSeconds = goal.verificationMethod?.durationSeconds;
  const isDurationBased =
    durationSeconds !== undefined && durationSeconds !== null;

  if (!startDate || !dueStartTime) return "No deadline";

  const now = new Date();
  const start = new Date(startDate);
  const dueStart = new Date(dueStartTime);
  const dueEnd = dueEndTime ? new Date(dueEndTime) : null;
  const durationMs = (goal.verificationMethod?.durationSeconds ?? 0) * 1000;
  const latestStartMs = dueEnd ? dueEnd.getTime() - durationMs : null;

  const startDiffMs = start.getTime() - now.getTime();
  const dueStartDiffMs = dueStart.getTime() - now.getTime();

  if (startDiffMs > 0) return formatDiff(startDiffMs);
  if (dueStartDiffMs > 0) return formatDiff(dueStartDiffMs);

  if (isDurationBased && dueEnd && durationMs > 0 && latestStartMs != null) {
    if (now.getTime() <= latestStartMs && now >= dueStart) return "Ongoing";
    return "Overdue";
  }

  return "Overdue";
}

function computeShowTimer(goal: InputGoal): boolean {
  const { startDate, dueStartTime, dueEndTime, verificationMethod } = goal;
  if (!startDate || !dueStartTime || !dueEndTime) return false;
  const isDurationBased = isDurationBasedVerification(verificationMethod);
  if (!isDurationBased) return false;

  const now = new Date();
  const start = new Date(startDate);
  const dueStart = new Date(dueStartTime);
  const dueEnd = new Date(dueEndTime);

  const durationMs = (verificationMethod?.durationSeconds ?? 0) * 1000;
  if (durationMs <= 0) return false;
  const latestStartMs = dueEnd.getTime() - durationMs;
  return now.getTime() >= dueStart.getTime() && now.getTime() <= latestStartMs;
}

export function useGoalsComputed<T extends InputGoal>(
  goals: ReadonlyArray<T> | undefined | null
) {
  const ids = useMemo(() => (goals ?? []).map((g) => g.id).join("|"), [goals]);
  const computeAll = () => {
    const timeLeft: Record<string, string> = {};
    const showTimer: Record<string, boolean> = {};
    const showCheckinModal: Record<string, boolean> = {};
    const showCheckinButton: Record<string, boolean> = {};
    const isDurationBased: Record<string, boolean> = {};
    for (const g of goals ?? []) {
      isDurationBased[g.id] = isDurationBasedVerification(g.verificationMethod);
      timeLeft[g.id] = computeTimeLeft(g);
      showTimer[g.id] = computeShowTimer(g);
      // Check-in method logic
      const method = g.verificationMethod;
      const isCheckin = (method?.method ?? null) === "checkin";
      if (isCheckin && g.dueStartTime) {
        const now = new Date();
        const dueStart = new Date(g.dueStartTime);
        if (!g.dueEndTime) {
          const graceSec =
            typeof method?.graceTimeSeconds === "number"
              ? (method?.graceTimeSeconds as number)
              : 60;
          const graceUntil = new Date(dueStart.getTime() + graceSec * 1000);
          showCheckinModal[g.id] = now >= dueStart && now <= graceUntil;
          showCheckinButton[g.id] = false;
        } else {
          const dueEnd = new Date(g.dueEndTime);
          showCheckinButton[g.id] = now >= dueStart && now <= dueEnd;
          showCheckinModal[g.id] = false;
        }
      } else {
        showCheckinModal[g.id] = false;
        showCheckinButton[g.id] = false;
      }
    }
    return {
      timeLeft,
      showTimer,
      showCheckinModal,
      showCheckinButton,
      isDurationBased,
    };
  };

  const [state, setState] = useState<{
    timeLeft: Record<string, string>;
    showTimer: Record<string, boolean>;
    showCheckinModal: Record<string, boolean>;
    showCheckinButton: Record<string, boolean>;
    isDurationBased: Record<string, boolean>;
  }>(() => computeAll());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setState(computeAll());
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState(computeAll());
    }, 60_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ids]);

  return state;
}
