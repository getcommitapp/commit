import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GoalsListResponseSchema } from "@commit/types";
import { formatDate, formatTime } from "../utils";
import { useGoalsComputed } from "./useGoalsComputed";
import { useMemo } from "react";

export function useGoals() {
  const query = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const goals = await apiFetch("/goals", {}, GoalsListResponseSchema);
      return goals.map((goal) => ({
        ...goal,
        // Preserve raw values, add formatted variants
        startDateFormatted: formatDate(goal.startDate),
        endDateFormatted: formatDate(goal.endDate),
        dueStartTimeFormatted: formatTime(goal.dueStartTime),
        dueEndTimeFormatted: formatTime(goal.dueEndTime),
        createdAtFormatted: formatDate(goal.createdAt),
        updatedAtFormatted: formatDate(goal.updatedAt),
      }));
    },
  });

  const goalsForComputed = useMemo(() => query.data ?? [], [query.data]);
  const computed = useGoalsComputed(goalsForComputed);

  const data = (query.data ?? []).map((g) => ({
    ...g,
    timeLeft: computed.timeLeft[g.id],
    showTimer: computed.showTimer[g.id],
    showCheckinModal: computed.showCheckinModal[g.id],
    showCheckinButton: computed.showCheckinButton[g.id],
    isDurationBased: computed.isDurationBased[g.id],
  }));

  // Replace the `data` property type from useQuery with our augmented shape
  return { ...query, data } as Omit<typeof query, "data"> & {
    data: typeof data;
  };
}
