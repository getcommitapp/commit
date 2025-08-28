import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GroupsListResponseSchema,
  GroupGetResponseSchema,
  GroupGoalGetResponseSchema,
  type GroupsListResponse,
  type GroupGetResponse,
  type GroupGoalGetResponse,
} from "@commit/types";
import type { Group } from "@/components/groups/GroupCard";
import { formatTimestamp } from "@/lib/formatDate";

// Reuse logic from goals hook for time left calculation
function calculateTimeLeft(endDate: string | null): string {
  if (!endDate) return "No deadline";
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Overdue";
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) {
    return `${diffDays}d left`;
  } else if (diffHours > 0) {
    return `${diffHours}h left`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m left`;
  }
}

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async (): Promise<Group[]> => {
      const summaries = await apiFetch<GroupsListResponse>(
        "/groups",
        {},
        GroupsListResponseSchema
      );

      // Enrich each group with details + goal (optional)
      const groups: Group[] = await Promise.all(
        summaries.map(async (g): Promise<Group> => {
          let details: GroupGetResponse | undefined;
          let goal: GroupGoalGetResponse | undefined;
          try {
            details = await apiFetch<GroupGetResponse>(
              `/groups/${g.id}`,
              {},
              GroupGetResponseSchema
            );
          } catch (e) {
            // ignore, fallback to summary only
          }
          try {
            goal = await apiFetch<GroupGoalGetResponse>(
              `/groups/${g.id}/goal`,
              {},
              GroupGoalGetResponseSchema
            );
          } catch (e) {
            // ignore missing goal
          }

          const stake =
            goal?.stakeCents && goal?.currency
              ? `${goal.currency} ${(goal.stakeCents / 100).toFixed(2)}`
              : undefined;
          const rawStart = goal?.startDate ?? g.createdAt;
          const rawEnd = goal?.endDate ?? null;
          const startDate = formatTimestamp(rawStart);
          const endDate = rawEnd ? formatTimestamp(rawEnd) : "";

          const base = {
            id: g.id,
            title: g.name,
            description: g.description || "",
            memberCount: details?.members.length ?? 1,
            invitationCode: g.inviteCode,
          } as Group;

          if (rawStart) base.startDate = startDate;
          if (rawEnd) base.endDate = endDate;
          if (stake) base.totalStake = stake;
          if (rawEnd) base.timeLeft = calculateTimeLeft(rawEnd);

          if (goal) {
            base.goal = {
              id: goal.id,
              title: goal.name,
              stake,
              timeLeft: calculateTimeLeft(rawEnd),
              startDate,
              endDate,
            };
          }

          return base;
        })
      );

      return groups;
    },
  });
}
