import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupsListResponseSchema } from "@commit/types";
import { formatDate } from "../utils";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const groups = await apiFetch("/groups", {}, GroupsListResponseSchema);
      return groups.map((group) => {
        return {
          ...group,
          createdAtFormatted: formatDate(group.createdAt),
          updatedAtFormatted: formatDate(group.updatedAt),
          goal: {
            ...group.goal,
            timeLeft: group.goal.timeLeft ?? "",
          },
          totalStake: (group.goal.stakeCents ?? 0) * (group.memberCount ?? 1),
        };
      });
    },
    refetchInterval: 30_000,
  });
}
