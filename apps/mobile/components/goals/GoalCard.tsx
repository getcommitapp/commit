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

interface GoalCardProps {
  goal: NonNullable<ReturnType<typeof useGoals>["data"]>[number];
  accessibilityLabel?: string;
  testID?: string;
}

export function GoalCard({ goal, accessibilityLabel, testID }: GoalCardProps) {
  const mutedForeground = useThemeColor({}, "mutedForeground");

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { dismissAll } = useBottomSheetModal();

  const openDetails = useCallback(() => {
    // Ensure only one bottom sheet is visible at a time
    dismissAll();
    bottomSheetRef.current?.present();
  }, [dismissAll]);

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
        <Text
          style={{
            ...textVariants.subheadline,
            color: mutedForeground,
            marginHorizontal: 4,
          }}
        >
          &middot;
        </Text>
        <Text style={{ ...textVariants.subheadline, color: mutedForeground }}>
          {goal.timeLeft}
        </Text>
      </View>

      {goal.hasDurationVerification ? <GoalTimerRow goalId={goal.id} /> : null}
    </View>
  );

  const rightNode = (
    <View style={{ alignItems: "flex-end", gap: 2, marginLeft: spacing.lg }}>
      {/* {goal.streak && (
        <>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Flame width={16} height={16} color={danger} />
            <Text
              style={{
                ...textVariants.subheadlineEmphasized,
                color: mutedForeground,
              }}
              numberOfLines={1}
            >
              {goal.streak}
            </Text>
          </View>
        </>
      )} */}
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

function formatStake(currency: string, stakeCents: number) {
  return `${currency} ${(stakeCents / 100).toFixed(2)}`;
}
