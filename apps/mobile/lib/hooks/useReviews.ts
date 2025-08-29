import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalReviewListResponseSchema,
  type GoalReviewListResponse,
} from "@commit/types";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async (): Promise<GoalReviewListResponse> => {
      return await apiFetch<GoalReviewListResponse>(
        "/goals/review",
        {},
        GoalReviewListResponseSchema
      );
    },
  });
}
