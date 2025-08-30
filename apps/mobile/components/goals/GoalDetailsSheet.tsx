import React, { forwardRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FormGroup, FormItem } from "@/components/ui/form";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import { useGoalTimer, useStartGoalTimer } from "@/lib/hooks/useGoalTimer";
import { spacing, useThemeColor } from "@/components/Themed";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { Button } from "@/components/ui/Button";
import { isNowWithinGoalWindow } from "@/lib/utils";
import { useGoals } from "@/lib/hooks/useGoals";
import { useDeleteGoal } from "@/lib/hooks/useDeleteGoal";
import { GoalDetails } from "@/components/goals/GoalDetails";

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
    const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal(
      goal.id
    );

    return (
      <DetailsSheet
        ref={ref}
        title={goal.name}
        description={goal.description ?? ""}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
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

            {!timer &&
            isNowWithinGoalWindow(
              goal._raw.startDate,
              goal._raw.dueStartTime,
              goal._raw.dueEndTime
            ) ? (
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

        <GoalDetails goal={goal} />

        {goal.group ? (
          <FormGroup
            title="Group"
            backgroundStyle={{ backgroundColor: background }}
          >
            <FormItem label="Name" value={goal.group.name} />
            <FormItem
              label="Description"
              value={goal.group.description ?? ""}
            />
          </FormGroup>
        ) : null}

        {!timer && !goal.group ? (
          <Button
            title="Delete Goal"
            onPress={() =>
              !isDeleting &&
              deleteGoal(undefined, {
                onSuccess: () => {
                  onDelete?.(goal);
                },
              })
            }
            variant="danger"
            loading={isDeleting}
            accessibilityLabel="delete-goal"
            testID="delete-goal"
          />
        ) : null}
      </DetailsSheet>
    );
  }
);

GoalDetailsSheet.displayName = "GoalDetailsSheet";
