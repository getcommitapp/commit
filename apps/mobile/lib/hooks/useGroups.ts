import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupsListResponseSchema } from "@commit/types";
import { formatDate, formatTime } from "../utils";
import { useGoalsComputed } from "./useGoalsComputed";
import { useMemo } from "react";

export function useGroups() {
  const query = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const summaries = await apiFetch("/groups", {}, GroupsListResponseSchema);
      return summaries.map((group) => ({
        ...group,
        createdAtFormatted: formatDate(group.createdAt),
        updatedAtFormatted: formatDate(group.updatedAt),
        totalStake: (group.goal.stakeCents ?? 0) * (group.memberCount ?? 1),
        isOwner: group.isOwner,
        members: group.members,
        goal: {
          ...group.goal,
          startDateFormatted: formatDate(group.goal.startDate),
          endDateFormatted: formatDate(group.goal.endDate),
          dueStartTimeFormatted: formatTime(group.goal.dueStartTime),
          dueEndTimeFormatted: formatTime(group.goal.dueEndTime),
          createdAtFormatted: formatDate(group.goal.createdAt),
          updatedAtFormatted: formatDate(group.goal.updatedAt),
        },
      }));
    },
  });

  const goalsForComputed = useMemo(
    () => query.data?.map((g) => g.goal) ?? [],
    [query.data]
  );
  const computed = useGoalsComputed(goalsForComputed);
  const data = (query.data ?? []).map((g) => ({
    ...g,
    goal: {
      ...g.goal,
      timeLeft: computed.timeLeft[g.goal.id],
      showTimer: computed.showTimer[g.goal.id],
    },
  }));

  return { ...query, data } as typeof query & { data: typeof data };
}
