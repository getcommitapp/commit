import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalVerifyRequestSchema,
  GoalVerifyResponseSchema,
} from "@commit/types";

export function useGoalCheckin(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // Minimal payload for check-in; server can infer verification type
      const body = [{ startTime: new Date().toISOString() }];
      // Validate schema shape for safety in dev
      GoalVerifyRequestSchema.parse(body);
      const res = await apiFetch(
        `/goals/${goalId}/verify`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
        GoalVerifyResponseSchema
      );
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
