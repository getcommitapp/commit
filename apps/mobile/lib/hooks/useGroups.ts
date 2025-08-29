import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupsListResponseSchema } from "@commit/types";
import type { Group } from "@/components/groups/GroupCard";
import { formatTimestamp } from "@/lib/formatDate";
import { calculateTimeLeft } from "@/lib/utils";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async (): Promise<Group[]> => {
      const summaries = await apiFetch("/groups", {}, GroupsListResponseSchema);

      return summaries.map((g) => {
        const stake = g.goal
          ? `${g.goal.currency} ${(g.goal.stakeCents / 100).toFixed(2)}`
          : undefined;
        const endDate = g.goal?.endDate ?? null;
        const base: Group = {
          id: g.id,
          title: g.name,
          description: g.description || "",
          invitationCode: g.inviteCode,
          memberCount: g.memberCount,
          startDate: formatTimestamp(g.createdAt),
        };
        if (g.goal) {
          base.totalStake = stake;
          base.timeLeft = calculateTimeLeft(endDate);
          base.endDate = endDate ? formatTimestamp(endDate) : "";
          base.goal = {
            id: g.goal.id,
            title: g.goal.name,
            stake,
            timeLeft: calculateTimeLeft(endDate),
            startDate: formatTimestamp(g.goal.startDate),
            endDate: endDate ? formatTimestamp(endDate) : "",
          };
        }
        return base;
      });
    },
  });
}
