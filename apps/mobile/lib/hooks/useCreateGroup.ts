import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GroupCreateRequestSchema,
  GroupCreateResponseSchema,
  type GroupCreateResponse,
} from "@commit/types";
import { z } from "zod";
import type { Group } from "@/components/groups/GroupCard";
import { formatTimestamp } from "@/lib/formatDate";

const CreateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});
export type CreateGroupInput = z.infer<typeof CreateInputSchema>;

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["groups", "create"],
    mutationFn: async (input: CreateGroupInput): Promise<Group> => {
      const parsed = CreateInputSchema.parse(input);
      const created = await apiFetch<GroupCreateResponse>(
        "/groups",
        {
          method: "POST",
          body: JSON.stringify({
            name: parsed.name,
            description: parsed.description ?? null,
          }),
        },
        GroupCreateResponseSchema
      );
      const startDate = formatTimestamp(created.createdAt);
      const group: Group = {
        id: created.id,
        title: created.name,
        description: created.description || "",
        memberCount: 1,
        invitationCode: created.inviteCode,
        startDate,
      };
      return group;
    },
    onSuccess: (group) => {
      qc.setQueryData<Group[] | undefined>(["groups"], (old) => {
        if (!old) return [group];
        // Avoid duplicates
        if (old.some((g) => g.id === group.id)) return old;
        return [group, ...old];
      });
    },
  });
}
