import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import {
  GoalCreateResponseSchema,
  type GoalCreateResponse,
  GoalCreateRequestSchema,
} from "@commit/types";
import { z } from "zod";
import type { Goal } from "@/components/goals/GoalCard";

// Local input schema (UI fields) before transforming to API shape
const CreateGoalInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  stake: z.string().optional(), // e.g. "25" (CHF)
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  dueStartTime: z.date().optional().nullable(),
  dueEndTime: z.date().optional().nullable(),
  verificationMethod: z
    .object({
      method: z.string(),
      durationSeconds: z.number().int().nullable().optional(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      radiusM: z.number().int().nullable().optional(),
      graceTime: z.date().nullable().optional(),
    })
    .optional(),
});
export type CreateGoalInput = z.infer<typeof CreateGoalInputSchema>;

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["goals", "create"],
    mutationFn: async (input: CreateGoalInput): Promise<Goal> => {
      const parsed = CreateGoalInputSchema.parse(input);

      // Convert stake CHF string -> cents (default 0 if empty)
      const stakeNumber = parsed.stake
        ? Number(parsed.stake.replace(/,/g, "."))
        : 0;
      const stakeCents = Math.round(stakeNumber * 100);

      // Merge date + time components: if time missing, reuse date at 00:00
      const combine = (date: Date, time?: Date | null) => {
        if (!time) return date;
        const d = new Date(date);
        d.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return d;
      };

      const startDate = parsed.startDate;
      const endDate = parsed.endDate ?? null;
      const dueStart = combine(
        parsed.startDate,
        parsed.dueStartTime ?? parsed.startDate
      );
      const dueEnd = parsed.dueEndTime
        ? combine(parsed.endDate ?? parsed.startDate, parsed.dueEndTime)
        : null;

      const body = {
        name: parsed.title,
        description: parsed.description ?? null,
        stakeCents,
        currency: "CHF",
        recurrence: null,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : null,
        dueStartTime: dueStart.toISOString(),
        dueEndTime: dueEnd ? dueEnd.toISOString() : null,
        destinationType: "user", // only user destination for now
        destinationUserId: null,
        destinationCharityId: null,
        verificationMethod: parsed.verificationMethod
          ? {
              method: parsed.verificationMethod.method,
              durationSeconds: parsed.verificationMethod.durationSeconds ?? null,
              latitude: parsed.verificationMethod.latitude ?? null,
              longitude: parsed.verificationMethod.longitude ?? null,
              radiusM: parsed.verificationMethod.radiusM ?? null,
              graceTime: parsed.verificationMethod.graceTime
                ? parsed.verificationMethod.graceTime.toISOString()
                : null,
            }
          : undefined,
      } satisfies z.infer<typeof GoalCreateRequestSchema>;

      const created = await apiFetch<GoalCreateResponse>(
        `/goals`,
        { method: "POST", body: JSON.stringify(body) },
        GoalCreateResponseSchema
      );

      const goal: Goal = {
        id: created.id,
        title: created.name,
        description: created.description || "",
        stake: `${created.currency} ${(created.stakeCents / 100).toFixed(2)}`,
        timeLeft: calculateTimeLeft(created.endDate),
        startDate: created.startDate,
        endDate: created.endDate || "",
      };
      return goal;
    },
    onSuccess: (goal) => {
      // Update cached goals list optimistically
      qc.setQueryData<Goal[] | undefined>(["goals"], (old) => {
        if (!old) return [goal];
        if (old.some((g) => g.id === goal.id)) return old;
        return [goal, ...old];
      });
    },
  });
}

function calculateTimeLeft(endDate: string | null): string {
  if (!endDate) return "No deadline";
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Overdue";
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d left`;
  if (diffHours > 0) return `${diffHours}h left`;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes}m left`;
}
