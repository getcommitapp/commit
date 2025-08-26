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

type GoalDetailsSheetProps = {
  goal: Goal;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
  onDelete?: (goal: Goal) => void;
  onDismiss?: () => void;
};

const GoalDetailsSheet = forwardRef<BottomSheetModal, GoalDetailsSheetProps>(
  (
    { goal, snapPoints, enableDynamicSizing = false, onDelete, onDismiss },
    ref
  ) => {
    const mutedForeground = useThemeColor({}, "mutedForeground");
    const danger = useThemeColor({}, "danger");
    const cardBg = useThemeColor({}, "card");
    const border = useThemeColor({}, "border");
    const { dismiss } = useBottomSheetModal();

    const resolvedSnapPoints = useMemo(
      () => snapPoints ?? ["40%", "75%"],
      [snapPoints]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={resolvedSnapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.lg,
            gap: spacing.lg,
          }}
        >
          <View style={{ gap: spacing.sm }}>
            <ThemedText style={{ ...textVariants.title3 }}>
              {goal.title}
            </ThemedText>
            <Text
              style={{ ...textVariants.subheadline, color: mutedForeground }}
            >
              Stay consistent and keep your streak alive. This is a mock
              description explaining the goal in more detail.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 12,
              borderColor: border,
              borderWidth: 1,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Stake", value: goal.stake },
              { label: "Time Left", value: goal.timeLeft },
              { label: "Frequency", value: "Daily" },
              { label: "Category", value: "Fitness" },
            ].map((row, index, arr) => (
              <View
                key={row.label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: spacing.xl,
                  paddingVertical: spacing.md,
                  borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                  borderBottomColor: border,
                }}
              >
                <Text
                  style={{
                    ...textVariants.subheadline,
                    color: mutedForeground,
                  }}
                >
                  {row.label}
                </Text>
                <ThemedText style={{ ...textVariants.bodyEmphasized }}>
                  {row.value}
                </ThemedText>
              </View>
            ))}
          </View>

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
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

GoalDetailsSheet.displayName = "GoalDetailsSheet";

export default GoalDetailsSheet;
