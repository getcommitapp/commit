import { useThemeColor } from "@/components/Themed";
import { FormGroup, FormItem } from "@/components/ui/form";
import { capitalize, formatDurationSeconds, formatStake } from "@/lib/utils";
import { useGoals } from "@/lib/hooks/useGoals";

type Goal = NonNullable<ReturnType<typeof useGoals>["data"]>[number];

interface GoalDetailsProps {
  goal?: Goal | null;
  title?: string;
}

export function GoalDetails({ goal, title = "Details" }: GoalDetailsProps) {
  const background = useThemeColor({}, "background");

  return (
    <FormGroup title={title} backgroundStyle={{ backgroundColor: background }}>
      {goal ? (
        <>
          <FormItem
            label="State"
            value={
              goal.state ? capitalize(goal.state.replaceAll("_", " ")) : "—"
            }
          />
          <FormItem
            label="Stake"
            value={formatStake(goal.currency, goal.stakeCents ?? 0)}
          />
          <FormItem
            label="Verification Method"
            value={
              goal.verificationMethod?.method
                ? capitalize(goal.verificationMethod.method)
                : "—"
            }
          />
          <FormItem label="Time Left" value={goal?.timeLeft ?? "—"} />
          <FormItem label="Start Date" value={goal.startDateFormatted ?? "—"} />
          <FormItem label="End Date" value={goal.endDateFormatted ?? "—"} />
          <FormItem
            label="Due Start Time"
            value={goal.dueStartTimeFormatted ?? "—"}
          />
          <FormItem
            label="Due End Time"
            value={goal.dueEndTimeFormatted ?? "—"}
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
        </>
      ) : (
        <FormItem label="Status" value="No goal linked" />
      )}
    </FormGroup>
  );
}
