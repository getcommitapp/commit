import React, { forwardRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FormGroup, FormItem } from "@/components/ui/form";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import { useGoalTimer, useStartGoalTimer } from "@/lib/hooks/useGoalTimer";
import { spacing, useThemeColor } from "@/components/Themed";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/lib/hooks/useGoals";

type Goal = NonNullable<ReturnType<typeof useGoals>["data"]>[number];

interface GoalDetailsSheetProps {
  goal: Goal;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
  onDelete?: (goal: Goal) => void;
  onDismiss?: () => void;
}

export const GoalDetailsSheet = forwardRef<
  BottomSheetModal,
  GoalDetailsSheetProps
>(
  (
    { goal, snapPoints, enableDynamicSizing = true, onDelete, onDismiss },
    ref
  ) => {
    const background = useThemeColor({}, "background");
    const { data: timer } = useGoalTimer(goal.id);
    const { mutate: startTimer, isPending } = useStartGoalTimer(goal.id);
    const { elapsedLabel } = useElapsedTimer(timer?.startedAt);

    return (
      <DetailsSheet
        ref={ref}
        title={goal.name}
        description={goal.description ?? ""}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
        actionButton={
          timer
            ? undefined
            : onDelete
              ? {
                  label: "Delete Goal",
                  onPress: () => onDelete(goal),
                  variant: "danger",
                }
              : undefined
        }
      >
        {goal.hasDurationVerification ? (
          <View style={{ marginBottom: spacing.xl }}>
            <FormGroup
              title="Progress"
              style={{ marginBottom: spacing.sm }}
              backgroundStyle={{ backgroundColor: background }}
            >
              {timer ? (
                <>
                  <FormItem label="Status" value="Running" />
                  <FormItem label="Elapsed" value={elapsedLabel ?? "–"} />
                </>
              ) : (
                <>
                  <FormItem label="Status" value="Timer not started" />
                </>
              )}
            </FormGroup>

            {!timer ? (
              <Button
                title="Start Timer"
                onPress={() => !isPending && startTimer()}
                loading={isPending}
                testID="start-goal-timer"
                accessibilityLabel="start-goal-timer"
              />
            ) : null}
          </View>
        ) : null}

        <FormGroup
          title="Details"
          backgroundStyle={{ backgroundColor: background }}
        >
          <FormItem
            label="Stake"
            value={`${goal.currency} ${(goal.stakeCents / 100).toFixed(2)}`}
          />
          <FormItem label="Time Left" value={goal.timeLeft} />
          <FormItem label="Start Date" value={goal.startDate} />
          <FormItem label="End Date" value={goal.endDate ?? ""} />
          <FormItem label="Due Start Time" value={goal.dueStartTime} />
          <FormItem label="Due End Time" value={goal.dueEndTime ?? ""} />
        </FormGroup>
      </DetailsSheet>
    );
  }
);

GoalDetailsSheet.displayName = "GoalDetailsSheet";
