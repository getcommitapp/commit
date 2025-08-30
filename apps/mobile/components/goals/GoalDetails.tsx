import { useThemeColor } from "@/components/Themed";
import { FormGroup, FormItem } from "@/components/ui/form";
import { formatDurationSeconds, formatStake } from "@/lib/utils";

interface GoalLike {
  currency: string;
  stakeCents: number;
  verificationMethod?: { durationSeconds?: number | null } | null;
  timeLeft?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dueStartTime?: string | null;
  dueEndTime?: string | null;
}

interface GoalDetailsProps {
  goal?: GoalLike | null;
  title?: string;
}

export function GoalDetails({ goal, title = "Details" }: GoalDetailsProps) {
  const background = useThemeColor({}, "background");

  return (
    <FormGroup title={title} backgroundStyle={{ backgroundColor: background }}>
      {goal ? (
        <>
          <FormItem
            label="Stake"
            value={formatStake(goal.currency, goal.stakeCents ?? 0)}
          />
          {goal.verificationMethod?.durationSeconds ? (
            <FormItem
              label="Duration"
              value={
                formatDurationSeconds(
                  goal.verificationMethod.durationSeconds
                ) || "—"
              }
            />
          ) : null}
          <FormItem label="Time Left" value={goal.timeLeft ?? "—"} />
          <FormItem label="Start Date" value={goal.startDate ?? "—"} />
          <FormItem label="End Date" value={goal.endDate ?? "—"} />
          <FormItem label="Due Start Time" value={goal.dueStartTime ?? "—"} />
          <FormItem label="Due End Time" value={goal.dueEndTime ?? "—"} />
        </>
      ) : (
        <FormItem label="Status" value="No goal linked" />
      )}
    </FormGroup>
  );
}
