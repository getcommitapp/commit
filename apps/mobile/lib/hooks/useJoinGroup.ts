import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupSummarySchema, type GroupSummary } from "@commit/types";
import type { Group } from "@/components/groups/GroupCard";
import { formatTimestamp } from "@/lib/formatDate";

// Expected API: POST /api/groups/join { code } -> GroupSummary
// Backend not yet implemented; this will fail until endpoint exists.
export function useJoinGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["groups", "join"],
    mutationFn: async (code: string): Promise<Group> => {
      try {
        const res = await apiFetch<GroupSummary>(
          "/groups/join",
          {
            method: "POST",
            body: JSON.stringify({ code }),
          },
          GroupSummarySchema
        );
        const startDate = formatTimestamp(res.createdAt);
        const group: Group = {
          id: res.id,
          title: res.name,
            description: res.description || "",
          invitationCode: res.inviteCode,
          startDate,
          memberCount: 1, // unknown until refetched
        };
        return group;
      } catch (e) {
        if (e instanceof Error) {
          // Map common backend errors
          if (/404/.test(e.message)) {
            e.message = "Invitation code not found";
          } else if (/409/.test(e.message)) {
            e.message = "You're already a member";
          } else if (/400/.test(e.message)) {
            e.message = "Invalid invitation code";
          }
        }
        throw e;
      }
    },
    onSuccess: (group) => {
      qc.setQueryData<Group[] | undefined>(["groups"], (old) => {
        if (!old) return [group];
        if (old.some((g) => g.id === group.id)) return old;
        return [...old, group];
      });
    },
  });
}
