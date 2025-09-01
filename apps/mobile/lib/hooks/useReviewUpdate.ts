import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GoalReviewUpdateRequest } from "@commit/types";

export function useReviewUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goalId,
      approvalStatus,
    }: {
      goalId: string;
      approvalStatus: GoalReviewUpdateRequest["approvalStatus"];
    }) => {
      return await apiFetch(`/goals/${goalId}/review`, {
        method: "PUT",
        body: JSON.stringify({ approvalStatus }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
