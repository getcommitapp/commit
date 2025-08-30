import React from "react";
import { View } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import {
  spacing,
  ThemedText,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import { Button } from "@/components/ui/Button";
import { useGoalCheckin } from "@/lib/hooks/useCheckin";

export default function GoalCheckinModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const { mutate: checkin, isPending } = useGoalCheckin(String(id));

  return (
    <>
      <Stack.Screen
        options={{
          title: "Check-in",
          presentation: "modal",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: background,
          padding: spacing.lg,
          gap: spacing.lg,
          justifyContent: "center",
        }}
      >
        <ThemedText style={{ ...textVariants.title2, textAlign: "center" }}>
          Ready to check-in?
        </ThemedText>
        <ThemedText style={{ ...textVariants.body, textAlign: "center" }}>
          Please confirm your check-in now. If you miss this window, the goal
          will be marked as failed.
        </ThemedText>
        <View style={{ gap: spacing.md }}>
          <Button
            title="Check-in"
            size="lg"
            onPress={() =>
              !isPending &&
              checkin(undefined, {
                onSuccess: () => {
                  // Close the modal after successful check-in
                  router.dismiss();
                },
              })
            }
            loading={isPending}
            accessibilityLabel={`checkin-modal-${id}`}
            testID={`checkin-modal-${id}`}
          />
        </View>
      </View>
    </>
  );
}
