import React, { useRef, useCallback } from "react";
import { Text, View, Pressable } from "react-native";
import { Card } from "@/components/ui/Card";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useGoalTimer } from "@/lib/hooks/useGoalTimer";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { GoalDetailsSheet } from "./GoalDetailsSheet";
import { useGoals } from "@/lib/hooks/useGoals";
import { formatStake, capitalize } from "@/lib/utils";
import IonIcons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/ui/Button";
import { useGoalCheckin } from "@/lib/hooks/useCheckin";

interface GoalCardProps {
  goal: NonNullable<ReturnType<typeof useGoals>["data"]>[number];
  accessibilityLabel?: string;
  testID?: string;
}

export function GoalCard({ goal, accessibilityLabel, testID }: GoalCardProps) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { dismissAll } = useBottomSheetModal();
  const { mutate: checkin, isPending: isCheckingIn } = useGoalCheckin(goal.id);
  // Global check-in modal presentation is handled at RootLayout level.

  const openDetails = useCallback(() => {
    // Ensure only one bottom sheet is visible at a time
    dismissAll();
    bottomSheetRef.current?.present();
  }, [dismissAll]);

  const isDurationBased = goal.isDurationBased;

  const leftNode = (
    <View style={{ gap: 2 }}>
      <ThemedText
        style={{
          ...textVariants.bodyEmphasized,
        }}
        numberOfLines={1}
      >
        {goal.name}
      </ThemedText>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <ThemedText style={{ ...textVariants.subheadline }}>
          {formatStake(goal.currency, goal.stakeCents)}
        </ThemedText>
        {goal.state ? (
          <>
            <Text
              style={{
                ...textVariants.subheadline,
                color: mutedForeground,
                marginHorizontal: 4,
              }}
            >
              &middot;
            </Text>
            <Text
              style={{ ...textVariants.subheadline, color: mutedForeground }}
            >
              {capitalize(goal.state.replaceAll("_", " "))}
            </Text>
          </>
        ) : null}
        {goal.timeLeft ? (
          <>
            <Text
              style={{
                ...textVariants.subheadline,
                color: mutedForeground,
                marginHorizontal: 4,
              }}
            >
              &middot;
            </Text>
            <Text
              style={{ ...textVariants.subheadline, color: mutedForeground }}
            >
              {goal.timeLeft}
            </Text>
          </>
        ) : null}
      </View>

      {isDurationBased && goal.showTimer ? (
        <GoalTimerRow goalId={goal.id} />
      ) : null}
      {!isDurationBased && goal.showCheckinButton ? (
        <View style={{ marginTop: 4 }}>
          <Button
            title="Check-in"
            size="sm"
            onPress={() => !isCheckingIn && checkin()}
            loading={isCheckingIn}
            accessibilityLabel={`checkin-${goal.id}`}
            testID={`checkin-${goal.id}`}
          />
        </View>
      ) : null}
    </View>
  );

  const primary = useThemeColor({}, "primary");
  const rightNode = (
    <View style={{ alignItems: "flex-end", gap: 2, marginLeft: spacing.lg }}>
      {goal.groupId ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IonIcons name="people" size={16} color={primary} />
        </View>
      ) : null}
    </View>
  );

  return (
    <>
      <Pressable onPress={openDetails} accessibilityRole="button">
        <Card
          left={leftNode}
          right={rightNode}
          accessibilityLabel={
            accessibilityLabel ??
            `Goal ${goal.name}, ${formatStake(goal.currency, goal.stakeCents)}, ${goal.timeLeft}`
          }
          testID={testID}
        />
      </Pressable>

      <GoalDetailsSheet ref={bottomSheetRef} goal={goal} />
    </>
  );
}

function GoalTimerRow({ goalId }: { goalId: string }) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const { data: timer } = useGoalTimer(goalId);
  const { elapsedLabel } = useElapsedTimer(timer?.startedAt);
  if (!timer) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text style={{ ...textVariants.footnote, color: mutedForeground }}>
        Timer: {elapsedLabel ?? "–"}
      </Text>
    </View>
  );
}
