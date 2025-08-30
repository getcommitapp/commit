import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GroupDeleteResponseSchema,
  GroupLeaveResponseSchema,
} from "@commit/types";

interface UseLeaveOrDeleteGroupArgs {
  isOwner: boolean;
}

export function useLeaveOrDeleteGroup({ isOwner }: UseLeaveOrDeleteGroupArgs) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      if (isOwner) {
        // DELETE group
        const res = await apiFetch(
          `/groups/${groupId}`,
          { method: "DELETE" },
          GroupDeleteResponseSchema
        );
        return res;
      }
      // Leave group
      const res = await apiFetch(
        `/groups/${groupId}/leave`,
        { method: "POST" },
        GroupLeaveResponseSchema
      );
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
