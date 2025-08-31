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
        timeLeft: g.timeLeft ?? "",
        showTimer: !!g.engineFlags?.showTimer,
        showCheckinModal: !!g.engineFlags?.showCheckinModal,
        showCheckinButton: !!g.engineFlags?.showCheckinButton,
        isDurationBased: !!g.engineFlags?.isDurationBased,
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
