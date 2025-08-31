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
      // Optimistically clear any modal flags to avoid immediate re-open
      qc.setQueriesData<
        { id: string; showCheckinModal?: boolean }[] | undefined
      >({ queryKey: ["goals"] }, (old) =>
        old
          ? old.map((g) =>
              g.id === goalId ? { ...g, showCheckinModal: false } : g
            )
          : old
      );
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
