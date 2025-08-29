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
      console.log(goals);
      return goals.map((goal) => ({
        ...goal,
        startDate: formatDate(goal.startDate),
        endDate: formatDate(goal.endDate),
        dueStartTime: formatTime(goal.dueStartTime),
        dueEndTime: formatTime(goal.dueEndTime),
        createdAt: formatDate(goal.createdAt),
        updatedAt: formatDate(goal.updatedAt),
        timeLeft: calculateTimeLeft(goal.endDate),
      }));
    },
  });
}
