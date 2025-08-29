import React, { useRef, useCallback } from "react";
import { Text, View, Pressable } from "react-native";
import Card from "@/components/ui/Card";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import Flame from "@/assets/icons/flame.svg";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useGoalTimer } from "@/lib/hooks/useGoalTimer";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { GoalDetailsSheet } from "./GoalDetailsSheet";

export type Goal = {
  id: string;
  title: string;
  description: string;
  stake: string; // e.g. CHF 50
  timeLeft: string; // e.g. 2h left
  startDate: string; // e.g. 2025-01-01
  endDate: string; // e.g. 2025-01-31
  streak?: number; // optional flame count
  hasDurationVerification: boolean;
};

type GoalCardProps = {
  goal: Goal;
  accessibilityLabel?: string;
  testID?: string;
};

export default function GoalCard({
  goal,
  accessibilityLabel,
  testID,
}: GoalCardProps) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const danger = useThemeColor({}, "danger");

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
        {goal.title}
      </ThemedText>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <ThemedText style={{ ...textVariants.subheadline }}>
          {goal.stake}
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
      {goal.streak && (
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
      )}
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
            `Goal ${goal.title}, ${goal.stake}, ${goal.timeLeft}`
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
