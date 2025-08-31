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
            occurrence: group.goal.occurrence ?? null,
            actions: group.goal.actions ?? [],
            nextTransitionAt: group.goal.nextTransitionAt ?? null,
            method: group.goal.method,
            durationSeconds: group.goal.durationSeconds ?? null,
            graceTimeSeconds: group.goal.graceTimeSeconds ?? null,
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
