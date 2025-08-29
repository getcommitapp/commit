import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { calculateTimeLeft } from "../utils";
import { GoalsListResponseSchema } from "@commit/types";
import { Goal } from "@/components/goals/GoalCard";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async (): Promise<Goal[]> => {
      const goals = await apiFetch("/goals", {}, GoalsListResponseSchema);

      // Transform API response to match GoalCard interface
      return goals.map((goal) => ({
        id: goal.id,
        title: goal.name,
        description: goal.description || "",
        stake: `${goal.currency} ${(goal.stakeCents / 100).toFixed(2)}`,
        timeLeft: calculateTimeLeft(goal.endDate),
        startDate: goal.startDate,
        endDate: goal.endDate || "",
        // Note: streak is not available in the API response, so it's omitted
      }));
    },
  });
}