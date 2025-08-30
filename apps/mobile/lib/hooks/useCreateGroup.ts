import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { GroupCreateResponseSchema, GoalCreateRequest } from "@commit/types";
import { z } from "zod";

const CreateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  goal: z.custom<GoalCreateRequest>(),
});
export type CreateGroupInput = z.infer<typeof CreateInputSchema>;

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["groups", "create"],
    mutationFn: async (input: CreateGroupInput) => {
      const parsed = CreateInputSchema.parse(input);
      const created = await apiFetch(
        "/groups",
        {
          method: "POST",
          body: JSON.stringify({
            name: parsed.name,
            description: parsed.description ?? null,
            goal: parsed.goal,
          }),
        },
        GroupCreateResponseSchema
      );
      return created;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
