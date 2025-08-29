import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalReviewUpdateRequest,
  GoalReviewUpdateRequestSchema,
} from "@commit/types";

export function useReviewUpdate() {
  return useMutation({
    mutationFn: async ({
      goalId,
      approvalStatus,
    }: {
      goalId: string;
      approvalStatus: GoalReviewUpdateRequest["approvalStatus"];
    }) => {
      return await apiFetch(
        `/goals/${goalId}/review`,
        {
          method: "PUT",
          body: JSON.stringify({ approvalStatus }),
        },
        GoalReviewUpdateRequestSchema
      );
    },
  });
}
