import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalCreateResponseSchema,
  type GoalCreateRequest,
} from "@commit/types";

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["goals", "create"],
    mutationFn: async (input: GoalCreateRequest) => {
      const created = await apiFetch(
        "/goals",
        {
          method: "POST",
          body: JSON.stringify(input),
        },
        GoalCreateResponseSchema
      );
      return created;
    },
    onSuccess: () => {
      // Refetch the goals list to ensure consistent shape with useGoals mapper
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
