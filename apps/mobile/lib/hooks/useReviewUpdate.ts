import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GoalReviewUpdateRequest } from "@commit/types";

export function useReviewUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goalId,
      userId,
      occurrenceDate,
      approvalStatus,
    }: {
      goalId: string;
      userId: string;
      occurrenceDate: string;
      approvalStatus: GoalReviewUpdateRequest["approvalStatus"];
    }) => {
      return await apiFetch(`/goals/review`, {
        method: "PUT",
        body: JSON.stringify({ goalId, userId, occurrenceDate, approvalStatus }),
      });
    },
    onMutate: async ({ goalId, userId, occurrenceDate }) => {
      await qc.cancelQueries({ queryKey: ["reviews"] });
      const previous = qc.getQueryData<any>(["reviews"]);
      if (previous) {
        qc.setQueryData(
          ["reviews"],
          previous.filter((r: any) => 
            !(r.goalId === goalId && r.userId === userId && r.occurrenceDate === occurrenceDate)
          )
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
