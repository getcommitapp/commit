import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalActionResponseSchema,
  GoalMovementStartRequestSchema,
  GoalMovementStopRequestSchema,
} from "@commit/types";

export function useLocalMovementTimer(goalId: string) {
  return useQuery<{ startedAt: string | null }>({
    queryKey: ["movement-timer", goalId],
    queryFn: async () => ({ startedAt: null }),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useMovementStart(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const body = {};
      GoalMovementStartRequestSchema.parse(body);
      return apiFetch(
        `/goals/${goalId}/movement/start`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
        GoalActionResponseSchema
      );
    },
    onSuccess: () => {
      const nowIso = new Date().toISOString();
      qc.setQueryData(["movement-timer", goalId], { startedAt: nowIso });
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

// App no longer exposes stop; cancellation is handled programmatically by motion detection
