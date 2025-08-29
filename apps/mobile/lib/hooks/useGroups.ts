import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupsListResponseSchema } from "@commit/types";
import type { Group } from "@/components/groups/GroupCard";
import { formatTimestamp } from "@/lib/formatDate";
import { useGoals } from "./useGoals";

export function useGroups() {
  // Fetch groups list once
  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: async (): Promise<(Group & { goalId?: string | null })[]> => {
      const summaries = await apiFetch("/groups", {}, GroupsListResponseSchema);

      return summaries.map((g) => {
        // Note: include goalId at runtime for later enrichment; UI types ignore it.
        const base = {
          id: g.id,
          title: g.name,
          description: g.description || "",
          invitationCode: g.inviteCode,
          memberCount: g.memberCount,
          startDate: formatTimestamp(g.createdAt),
          goalId: g.goalId ?? null,
        } as Group & { goalId?: string | null };
        return base;
      });
    },
  });

  // Fetch goals list once and enrich groups locally (no per-group calls)
  const goalsQuery = useGoals();

  const merged = useMemo(() => {
    const groups = (groupsQuery.data ?? []) as (Group & {
      goalId?: string | null;
    })[];
    const goals = goalsQuery.data ?? [];

    const goalsById = new Map(goals.map((goal) => [goal.id, goal]));

    return groups.map((grp) => {
      const goal = grp.goalId ? goalsById.get(grp.goalId) : undefined;
      if (!goal) return grp as Group;

      return {
        ...grp,
        totalStake: goal.stake,
        timeLeft: goal.timeLeft,
        endDate: goal.endDate,
        // Provide goal block for details sheet
        goal: {
          id: goal.id,
          title: goal.title,
          stake: goal.stake,
          timeLeft: goal.timeLeft,
          startDate: goal.startDate,
          endDate: goal.endDate,
        },
      } as Group;
    });
  }, [groupsQuery.data, goalsQuery.data]);

  // Return a unified query-like object with fields the UI uses
  return {
    data: merged as Group[] | undefined,
    isLoading: groupsQuery.isLoading || goalsQuery.isLoading,
    isFetching: groupsQuery.isFetching || goalsQuery.isFetching,
    isError: groupsQuery.isError || goalsQuery.isError,
    error: (groupsQuery.error as any) ?? (goalsQuery.error as any),
    refetch: async () => {
      await Promise.all([groupsQuery.refetch(), goalsQuery.refetch()]);
    },
  };
}
