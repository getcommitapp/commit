import React, { forwardRef } from "react";
import { View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FormGroup, FormItem } from "@/components/ui/form";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import { useLocalMovementTimer } from "@/lib/hooks/useMovement";
import { spacing, useThemeColor } from "@/components/Themed";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/lib/hooks/useGoals";
import { useDeleteGoal } from "@/lib/hooks/useDeleteGoal";
import { GoalDetails } from "@/components/goals/GoalDetails";
import { useGoalCheckin } from "@/lib/hooks/useCheckin";
import { useGoalPhoto } from "@/lib/hooks/usePhoto";
import { useUploadFile } from "@/lib/hooks/useUploadFile";
import * as ImagePicker from "expo-image-picker";

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
    const persistedTimerStartedAt = goal.occurrence?.timerStartedAt ?? null;
    const activeTimerStartedAt =
      persistedTimerStartedAt || localTimer?.startedAt || null;
    const { mutate: checkin, isPending: isCheckingIn } = useGoalCheckin(
      goal.id
    );
    const { remainingLabel, remainingMs } = useElapsedTimer(
      activeTimerStartedAt,
      {
        durationMs: goal.durationSeconds ? goal.durationSeconds * 1000 : null,
        onComplete: undefined,
      }
    );
    const { mutate: submitPhoto, isPending: isSubmittingPhoto } = useGoalPhoto(
      goal.id
    );
    const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
    const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal(
      goal.id
    );

    const hasActiveTimer = !!activeTimerStartedAt;

    return (
      <DetailsSheet
        ref={ref}
        title={goal.name}
        description={goal.description ?? ""}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
      >
        {hasActiveTimer && goal.method === "movement" ? (
          <View style={{ marginBottom: spacing.xl }}>
            <FormGroup
              title="Progress"
              style={{ marginBottom: spacing.sm }}
              backgroundStyle={{ backgroundColor: background }}
            >
              {activeTimerStartedAt && remainingMs !== 0 ? (
                <>
                  <FormItem label="Status" value="Running" />
                  <FormItem label="Remaining" value={remainingLabel ?? "–"} />
                </>
              ) : (
                <>
                  <FormItem label="Status" value="Timer not started" />
                </>
              )}
            </FormGroup>
          </View>
        ) : null}

        {!hasActiveTimer && goal.method === "checkin" ? (
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

        {!hasActiveTimer ? (
          <View style={{ marginBottom: spacing.xl }}>
            <Button
              title="Submit Photo"
              onPress={async () => {
                try {
                  const res = await ImagePicker.launchCameraAsync({
                    allowsEditing: false,
                    quality: 0.8,
                    cameraType: ImagePicker.CameraType.back,
                    mediaTypes: "images",
                  });
                  if (!res.canceled) {
                    const asset = res.assets[0];
                    const { url } = await uploadFile({
                      uri: asset.uri,
                      type:
                        asset.type === "image"
                          ? (asset.mimeType ?? "image/jpeg")
                          : "image/jpeg",
                      name: asset.fileName ?? "photo.jpg",
                    });
                    submitPhoto({ photoUrl: url });
                  }
                } catch (_) {}
              }}
              loading={isSubmittingPhoto || isUploading}
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
