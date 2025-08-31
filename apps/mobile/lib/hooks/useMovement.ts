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

export function useMovementStop(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const body = {};
      GoalMovementStopRequestSchema.parse(body);
      return apiFetch(
        `/goals/${goalId}/movement/stop`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
        GoalActionResponseSchema
      );
    },
    onSuccess: () => {
      qc.setQueryData(["movement-timer", goalId], { startedAt: null });
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
