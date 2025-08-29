import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalTimerGetResponseSchema,
  GoalTimerStartResponseSchema,
} from "@commit/types";

export function useGoalTimer(goalId: string) {
  return useQuery({
    queryKey: ["goal-timer", goalId],
    queryFn: async () => {
      const res = await apiFetch(
        `/goals/${goalId}/timer`,
        {},
        GoalTimerGetResponseSchema
      );
      return res.timer;
    },
  });
}

export function useStartGoalTimer(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiFetch(
        `/goals/${goalId}/timer/start`,
        { method: "POST" },
        GoalTimerStartResponseSchema
      );
      return res.timer;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goal-timer", goalId] });
    },
  });
}
