import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupJoinResponseSchema } from "@commit/types";

// Expected API: POST /api/groups/join { code } -> GroupSummary
export function useJoinGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["groups", "join"],
    mutationFn: async (code: string) => {
      try {
        const res = await apiFetch(
          "/groups/join",
          {
            method: "POST",
            body: JSON.stringify({ code }),
          },
          GroupJoinResponseSchema
        );
        return res;
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
