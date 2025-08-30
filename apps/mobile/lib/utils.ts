export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function calculateTimeLeft(
  startDate: string | null,
  dueStartTime: string | null
): string {
  if (!startDate || !dueStartTime) return "No deadline";

  const now = new Date();
  const start = new Date(startDate);
  const dueStart = new Date(dueStartTime);

  // Calculate time left from start date
  const startDiffMs = start.getTime() - now.getTime();
  const dueStartDiffMs = dueStart.getTime() - now.getTime();

  // If we're past the due start time, show overdue
  if (dueStartDiffMs <= 0) return "Overdue";

  // If we're past the start date but before due start time, show time until due start
  if (startDiffMs <= 0 && dueStartDiffMs > 0) {
    return formatTimeDifference(dueStartDiffMs);
  }

  // If we're before the start date, show time until start
  return formatTimeDifference(startDiffMs);
}

function formatTimeDifference(diffMs: number): string {
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d left`;
  } else if (diffHours > 0) {
    return `${diffHours}h left`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m left`;
  }
}

export function formatDate(timestamp: string | null | undefined) {
  if (!timestamp) return timestamp;
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timestamp: string | null | undefined) {
  if (!timestamp) return timestamp;
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatStake(currency: string, stakeCents: number) {
  return `${currency} ${(stakeCents / 100).toFixed(2)}`;
}

export function computeStakeCents(stake: number | null): number {
  return stake != null && Number.isFinite(stake) ? Math.round(stake * 100) : 0;
}

export function computeDurationMinutes(
  method: string | undefined,
  duration: Date | null
): number | undefined {
  if (
    !method ||
    !(method === "location" || method === "movement") ||
    !duration
  ) {
    return undefined;
  }
  return duration.getHours() * 60 + duration.getMinutes();
}

export function isNowWithinGoalWindow(
  startDate: string | null,
  dueStartTime: string | null,
  dueEndTime: string | null
): boolean {
  if (!startDate || !dueStartTime || !dueEndTime) return false;

  const now = new Date();
  const start = new Date(startDate);
  const dueStart = new Date(dueStartTime);
  const dueEnd = new Date(dueEndTime);

  const sameDate =
    now.getUTCFullYear() === start.getUTCFullYear() &&
    now.getUTCMonth() === start.getUTCMonth() &&
    now.getUTCDate() === start.getUTCDate();

  if (!sameDate) return false;

  return now >= dueStart && now <= dueEnd;
}

export function formatDurationSeconds(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return undefined;
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
