export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export function formatRelativeTimeLeft(
  nextTransitionAt?: string | null
): string {
  if (!nextTransitionAt) return "";
  const target = new Date(nextTransitionAt);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "";
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes >= 60 * 24) return `${Math.floor(minutes / (60 * 24))}d left`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h left`;
  return `${minutes}m left`;
}
