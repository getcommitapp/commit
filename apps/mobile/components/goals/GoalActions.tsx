import React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { useGoals } from "@/lib/hooks/useGoals";
import { useGoalCheckin } from "@/lib/hooks/useCheckin";
import { useMovementStart } from "@/lib/hooks/useMovement";
import { useUploadFile } from "@/lib/hooks/useUploadFile";
import { useGoalPhoto } from "@/lib/hooks/usePhoto";
import * as ImagePicker from "expo-image-picker";

type Goal = NonNullable<ReturnType<typeof useGoals>["data"]>[number];

export interface GoalActionsProps {
  goal: Goal;
  size?: "sm" | "md";
}

export const GoalActions: React.FC<GoalActionsProps> = ({
  goal,
  size = "md",
}) => {
  const { mutate: checkin, isPending: isCheckingIn } = useGoalCheckin(goal.id);
  const { mutate: movementStart, isPending: isStarting } = useMovementStart(
    goal.id
  );
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: submitPhoto, isPending: isSubmittingPhoto } = useGoalPhoto(
    goal.id
  );

  const loading =
    isCheckingIn || isStarting || isUploading || isSubmittingPhoto;
  // Decide which type of action(s) should display
  const showCheckin = goal.method === "checkin";
  const showMovement = goal.method === "movement";
  const showPhoto =
    goal.method === "photo" && goal.state === "window_open";

  // If nothing to show, render nothing to avoid vertical gap in parent layout
  if (!showCheckin && !showMovement && !showPhoto) return null;

  const handlePhoto = async () => {
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
  };

  return (
    <View style={{ gap: 8 }}>
  {showCheckin ? (
        <Button
          title="Check-in"
          size={size}
          onPress={() => !isCheckingIn && checkin()}
          loading={isCheckingIn}
          testID={`checkin-${goal.id}`}
          accessibilityLabel={`checkin-${goal.id}`}
        />
      ) : null}

  {showMovement ? (
        <Button
          title="Start timer"
          size={size}
          onPress={() => !isStarting && movementStart()}
          loading={isStarting}
          testID={`movement-start-${goal.id}`}
          accessibilityLabel={`movement-start-${goal.id}`}
        />
      ) : null}

      {showPhoto ? (
        <Button
          title="Submit Photo"
          size={size}
          onPress={handlePhoto}
          loading={loading}
          testID={`submit-photo-${goal.id}`}
          accessibilityLabel={`submit-photo-${goal.id}`}
        />
      ) : null}
    </View>
  );
};
