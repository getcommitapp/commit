import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GoalDeleteResponseSchema } from "@commit/types";

export function useDeleteGoal(goalId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiFetch(
        `/goals/${goalId}`,
        { method: "DELETE" },
        GoalDeleteResponseSchema
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal-timer", goalId] });
    },
  });
}
