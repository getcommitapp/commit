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
              : "—";
          const rawStart = goal?.startDate ?? g.createdAt;
          const rawEnd = goal?.endDate ?? null;
          const startDate = formatTimestamp(rawStart);
          const endDate = rawEnd ? formatTimestamp(rawEnd) : "";

          return {
            id: g.id,
            title: g.name,
            description: g.description || "",
            totalStake: stake, // Currently using single goal stake (no aggregation)
            memberCount: details?.members.length ?? 1, // fallback creator only
            timeLeft: calculateTimeLeft(rawEnd),
            startDate,
            endDate,
            invitationCode: g.inviteCode,
            goal: {
              id: goal?.id || g.goalId || g.id,
              title: goal?.name || g.name,
              stake,
              timeLeft: calculateTimeLeft(rawEnd),
              startDate,
              endDate,
              // streak unknown
            },
          };
        })
      );

      return groups;
    },
  });
}
