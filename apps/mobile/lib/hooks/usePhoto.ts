import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalActionResponseSchema,
  GoalPhotoRequestSchema,
} from "@commit/types";

export function useGoalPhoto(goalId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { photoUrl: string }) => {
      const body = {
        photoUrl: input.photoUrl,
      };
      GoalPhotoRequestSchema.parse(body);
      const res = await apiFetch(
        `/goals/${goalId}/photo`,
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
