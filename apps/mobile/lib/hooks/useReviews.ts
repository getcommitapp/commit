import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GoalReviewListResponseSchema } from "@commit/types";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await apiFetch("/goals/review", {}, GoalReviewListResponseSchema);
    },
  });
}
