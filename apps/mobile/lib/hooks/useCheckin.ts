import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalActionResponseSchema,
  GoalCheckinRequestSchema,
} from "@commit/types";

export function useGoalCheckin(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const body = {};
      GoalCheckinRequestSchema.parse(body);
      const res = await apiFetch(
        `/goals/${goalId}/checkin`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
        GoalActionResponseSchema
      );
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
