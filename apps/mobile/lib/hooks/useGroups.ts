import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupsListResponseSchema } from "@commit/types";
import { calculateTimeLeft, formatDate, formatTime } from "../utils";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const summaries = await apiFetch("/groups", {}, GroupsListResponseSchema);
      return summaries.map((group) => ({
        ...group,
        createdAt: formatDate(group.createdAt),
        updatedAt: formatDate(group.updatedAt),
        totalStake: (group.goal.stakeCents ?? 0) * (group.memberCount ?? 1),
        isOwner: group.isOwner,
        members: group.members,
        goal: {
          ...group.goal,
          startDate: formatDate(group.goal.startDate),
          endDate: formatDate(group.goal.endDate),
          dueStartTime: formatTime(group.goal.dueStartTime),
          dueEndTime: formatTime(group.goal.dueEndTime),
          createdAt: formatDate(group.goal.createdAt),
          updatedAt: formatDate(group.goal.updatedAt),
          timeLeft: calculateTimeLeft(group.goal.endDate),
        },
      }));
    },
  });
}
