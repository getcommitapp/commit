import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { calculateTimeLeft } from "../utils";
import { GoalsListResponseSchema } from "@commit/types";
import { formatDate, formatTime } from "../utils";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const goals = await apiFetch("/goals", {}, GoalsListResponseSchema);
      return goals.map((goal) => ({
        ...goal,
        // Keep raw timestamps alongside formatted ones for logic checks
        _raw: {
          startDate: goal.startDate,
          dueStartTime: goal.dueStartTime,
          dueEndTime: goal.dueEndTime,
        },
        startDate: formatDate(goal.startDate),
        endDate: formatDate(goal.endDate),
        dueStartTime: formatTime(goal.dueStartTime),
        dueEndTime: formatTime(goal.dueEndTime),
        createdAt: formatDate(goal.createdAt),
        updatedAt: formatDate(goal.updatedAt),
        timeLeft: calculateTimeLeft(goal.startDate, goal.dueStartTime),
      }));
    },
  });
}
