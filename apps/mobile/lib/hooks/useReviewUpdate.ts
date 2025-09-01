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
    onMutate: async ({ goalId }) => {
      await qc.cancelQueries({ queryKey: ["reviews"] });
      const previous = qc.getQueryData<any>(["reviews"]);
      if (previous) {
        qc.setQueryData(
          ["reviews"],
          previous.filter((r: any) => r.goalId !== goalId)
        );
      }
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(["reviews"], context.previous);
      }
      console.error(error);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
