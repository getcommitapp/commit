export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function calculateTimeLeft(endDate: string | null): string {
  if (!endDate) return "No deadline";

  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "Overdue";

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
