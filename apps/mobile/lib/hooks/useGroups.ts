import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupsListResponseSchema } from "@commit/types";
import { formatDate, formatTime } from "../utils";

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
            showTimer: !!group.goal.engineFlags?.showTimer,
            showCheckinModal: !!group.goal.engineFlags?.showCheckinModal,
            showCheckinButton: !!group.goal.engineFlags?.showCheckinButton,
            isDurationBased: !!group.goal.engineFlags?.isDurationBased,
            startDateFormatted: formatDate(group.goal.startDate) ?? "",
            endDateFormatted: group.goal.endDate
              ? (formatDate(group.goal.endDate) ?? null)
              : null,
            dueStartTimeFormatted: formatTime(group.goal.dueStartTime) ?? "",
            dueEndTimeFormatted: group.goal.dueEndTime
              ? (formatTime(group.goal.dueEndTime) ?? null)
              : null,
            createdAtFormatted: formatDate(group.goal.createdAt) ?? "",
            updatedAtFormatted: formatDate(group.goal.updatedAt) ?? "",
          },
          totalStake: (group.goal.stakeCents ?? 0) * (group.memberCount ?? 1),
        };
      });
    },
    refetchInterval: 30_000,
  });
}
