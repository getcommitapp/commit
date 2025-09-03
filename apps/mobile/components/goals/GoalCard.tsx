import React, { useRef, useCallback, useMemo } from "react";
import { Text, View, Pressable } from "react-native";
import { Card } from "@/components/ui/Card";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useLocalMovementTimer,
  useMovementWatcher,
} from "@/lib/hooks/useMovement";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { GoalDetailsSheet } from "./GoalDetailsSheet";
import { useGoals } from "@/lib/hooks/useGoals";
import { formatStake, capitalize, formatRelativeTimeLeft } from "@/lib/utils";
import IonIcons from "@expo/vector-icons/Ionicons";
import { GoalActions } from "@/components/goals/GoalActions";

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

  const { data: localTimer } = useLocalMovementTimer(goal.id);
  const persistedTimerStartedAt = goal.occurrence?.timerStartedAt ?? null;
  const activeTimerStartedAt =
    persistedTimerStartedAt || localTimer?.startedAt || null;
  const hasActiveTimer = !!activeTimerStartedAt;

  // For movement goals, watch for motion when:
  // 1. There's an active timer (timer-based ongoing state), OR
  // 2. The goal state is "ongoing" (time-based ongoing state for goals without due end time)
  const shouldWatchMovement =
    goal.method === "movement" && (hasActiveTimer || goal.state === "ongoing");
  useMovementWatcher(
    goal.id,
    shouldWatchMovement,
    activeTimerStartedAt,
    goal.durationSeconds
  );
  const nextLabel = useMemo(
    () => formatRelativeTimeLeft(goal.nextTransitionAt),
    [goal.nextTransitionAt]
  );

  const leftNode = (
    <View>
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
        {nextLabel ? (
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
              {nextLabel}
            </Text>
          </>
        ) : null}
      </View>
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
          bottom={
            <View style={{ gap: 8 }}>
              {hasActiveTimer && goal.method === "movement" ? (
                <GoalTimerRow
                  key={`${goal.id}-${activeTimerStartedAt}`}
                  durationSeconds={goal.durationSeconds ?? 0}
                  startedAt={activeTimerStartedAt}
                />
              ) : null}
              {!hasActiveTimer ? <GoalActions goal={goal} size="sm" /> : null}
            </View>
          }
          accessibilityLabel={
            accessibilityLabel ??
            `Goal ${goal.name}, ${formatStake(goal.currency, goal.stakeCents)}`
          }
          testID={testID}
        />
      </Pressable>

      <GoalDetailsSheet ref={bottomSheetRef} goal={goal} />
    </>
  );
}

function GoalTimerRow({
  durationSeconds,
  startedAt,
}: {
  durationSeconds: number;
  startedAt: string | null;
}) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const { remainingLabel, remainingMs } = useElapsedTimer(startedAt, {
    durationMs: durationSeconds ? durationSeconds * 1000 : null,
    onComplete: undefined,
  });
  if (!startedAt || remainingMs === 0) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text style={{ ...textVariants.footnote, color: mutedForeground }}>
        Timer: {remainingLabel ?? "–"}
      </Text>
    </View>
  );
}
