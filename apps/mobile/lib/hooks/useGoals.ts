import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GoalsListResponseSchema } from "@commit/types";
import { formatDate, formatTime } from "../utils";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const goals = await apiFetch("/goals", {}, GoalsListResponseSchema);
      return goals.map((g) => ({
        ...g,
        occurrence: g.occurrence ?? null,
        actions: g.actions ?? [],
        nextTransitionAt: g.nextTransitionAt ?? null,
        method: g.method,
        durationSeconds: g.durationSeconds ?? null,
        graceTimeSeconds: g.graceTimeSeconds ?? null,
        startDateFormatted: formatDate(g.startDate) ?? "",
        endDateFormatted: g.endDate ? (formatDate(g.endDate) ?? null) : null,
        dueStartTimeFormatted: formatTime(g.dueStartTime) ?? "",
        dueEndTimeFormatted: g.dueEndTime
          ? (formatTime(g.dueEndTime) ?? null)
          : null,
        createdAtFormatted: formatDate(g.createdAt) ?? "",
        updatedAtFormatted: formatDate(g.updatedAt) ?? "",
      }));
    },
    refetchInterval: 30_000,
  });
}
