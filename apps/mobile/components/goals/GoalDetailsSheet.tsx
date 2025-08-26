import React, { forwardRef, useMemo } from "react";
import { Text, View, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import type { Goal } from "@/components/goals/GoalCard";
import { SettingsGroup, SettingsRow } from "@/components/ui/Settings";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const mutedForeground = useThemeColor({}, "mutedForeground");
    const danger = useThemeColor({}, "danger");
    const background = useThemeColor({}, "background");
    const border = useThemeColor({}, "border");
    const { dismiss } = useBottomSheetModal();

    const resolvedSnapPoints = useMemo(
      () => snapPoints ?? ["75%"],
      [snapPoints]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={resolvedSnapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
        backgroundStyle={{
          borderWidth: 1,
          borderColor: border,
        }}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.lg,
            gap: spacing.lg,
          }}
        >
          <SafeAreaView edges={["bottom"]}>
            <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
              <ThemedText style={{ ...textVariants.title3 }}>
                {goal.title}
              </ThemedText>
              <Text
                style={{ ...textVariants.subheadline, color: mutedForeground }}
              >
                {goal.description}
              </Text>
            </View>

            <SettingsGroup
              title="Details"
              backgroundStyle={{ backgroundColor: background }}
            >
              <SettingsRow label="Stake" value={goal.stake} />
              <SettingsRow label="Time Left" value={goal.timeLeft} />
              <SettingsRow label="Start Date" value={goal.startDate} />
              <SettingsRow label="End Date" value={goal.endDate} />
              <SettingsRow label="Frequency" value="Daily" />
              <SettingsRow label="Category" value="Fitness" last />
            </SettingsGroup>

            <Pressable
              onPress={() => {
                if (onDelete) onDelete(goal);
                // Close the modal after delete action
                dismiss();
              }}
              accessibilityRole="button"
              style={{
                backgroundColor: danger,
                paddingVertical: spacing.md,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...textVariants.bodyEmphasized,
                  color: "white",
                }}
              >
                Delete Goal
              </Text>
            </Pressable>
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

GoalDetailsSheet.displayName = "GoalDetailsSheet";
