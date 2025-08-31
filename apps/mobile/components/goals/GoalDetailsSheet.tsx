import React, { forwardRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FormGroup, FormItem } from "@/components/ui/form";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import {
  useMovementStart,
  useMovementStop,
  useLocalMovementTimer,
} from "@/lib/hooks/useMovement";
import { spacing, useThemeColor } from "@/components/Themed";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/lib/hooks/useGoals";
import { useDeleteGoal } from "@/lib/hooks/useDeleteGoal";
import { GoalDetails } from "@/components/goals/GoalDetails";
import { useGoalCheckin } from "@/lib/hooks/useCheckin";
import { useGoalPhoto } from "@/lib/hooks/usePhoto";

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
    const { data: localTimer } = useLocalMovementTimer(goal.id);
    const { mutate: startTimer, isPending } = useMovementStart(goal.id);
    const { mutate: stopTimer, isPending: isStopping } = useMovementStop(
      goal.id
    );
    const { mutate: checkin, isPending: isCheckingIn } = useGoalCheckin(
      goal.id
    );
    const { elapsedLabel } = useElapsedTimer(localTimer?.startedAt ?? null);
    const { mutate: submitPhoto, isPending: isSubmittingPhoto } = useGoalPhoto(
      goal.id
    );
    const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal(
      goal.id
    );

    const isDurationBased = goal.isDurationBased;

    return (
      <DetailsSheet
        ref={ref}
        title={goal.name}
        description={goal.description ?? ""}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
      >
        {isDurationBased && (localTimer?.startedAt || goal.showTimer) ? (
          <View style={{ marginBottom: spacing.xl }}>
            <FormGroup
              title="Progress"
              style={{ marginBottom: spacing.sm }}
              backgroundStyle={{ backgroundColor: background }}
            >
              {localTimer?.startedAt ? (
                <>
                  <FormItem label="Status" value="Running" />
                  <FormItem label="Elapsed" value={elapsedLabel ?? "–"} />
                  <Button
                    title="Stop Timer"
                    onPress={() => !isStopping && stopTimer()}
                    loading={isStopping}
                    testID="stop-goal-timer"
                    accessibilityLabel="stop-goal-timer"
                  />
                </>
              ) : (
                <>
                  <FormItem label="Status" value="Timer not started" />
                </>
              )}
            </FormGroup>

            {!localTimer?.startedAt && goal.showTimer ? (
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

        {!isDurationBased &&
        goal.method === "checkin" &&
        goal.showCheckinButton ? (
          <View style={{ marginBottom: spacing.xl }}>
            <Button
              title="Check-in"
              onPress={() => !isCheckingIn && checkin()}
              loading={isCheckingIn}
              testID="checkin-goal"
              accessibilityLabel="checkin-goal"
            />
          </View>
        ) : null}

        {!isDurationBased &&
        goal.method === "photo" &&
        goal.showCheckinButton ? (
          <View style={{ marginBottom: spacing.xl }}>
            <Button
              title="Submit Photo"
              onPress={() =>
                !isSubmittingPhoto &&
                submitPhoto({
                  photoUrl: "https://picsum.photos/seed/mobile/800/600",
                  photoDescription: "Mobile submission",
                })
              }
              loading={isSubmittingPhoto}
              testID="submit-photo-goal"
              accessibilityLabel="submit-photo-goal"
            />
          </View>
        ) : null}

        <GoalDetails goal={goal} />

        {!localTimer?.startedAt && !goal.groupId ? (
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
