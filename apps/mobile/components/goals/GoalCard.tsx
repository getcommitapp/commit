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
  useMovementStart,
} from "@/lib/hooks/useMovement";
import { useElapsedTimer } from "@/lib/hooks/useElapsedTimer";
import { GoalDetailsSheet } from "./GoalDetailsSheet";
import { useGoals } from "@/lib/hooks/useGoals";
import { formatStake, capitalize, formatRelativeTimeLeft } from "@/lib/utils";
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
  const { mutate: startMovement, isPending: isStarting } = useMovementStart(
    goal.id
  );
  // Global check-in modal presentation is handled at RootLayout level.

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
  const nextLabel = useMemo(
    () => formatRelativeTimeLeft(goal.nextTransitionAt),
    [goal.nextTransitionAt]
  );

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

      {hasActiveTimer && goal.method === "movement" ? (
        <GoalTimerRow
          durationSeconds={goal.durationSeconds ?? 0}
          startedAt={activeTimerStartedAt}
        />
      ) : null}
      {!hasActiveTimer ? (
        <GoalPrimaryAction
          goalId={goal.id}
          actions={goal.actions ?? []}
          onCheckin={() => !isCheckingIn && checkin()}
          onMovementStart={() => !isStarting && startMovement()}
        />
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
            `Goal ${goal.name}, ${formatStake(goal.currency, goal.stakeCents)}`
          }
          testID={testID}
        />
      </Pressable>

      <GoalDetailsSheet ref={bottomSheetRef} goal={goal} />
    </>
  );
}

function GoalPrimaryAction({
  goalId,
  actions,
  onCheckin,
  onMovementStart,
}: {
  goalId: string;
  actions: {
    kind: "checkin" | "upload_photo" | "movement_start" | "open_location";
    presentation: "button" | "modal";
    visibleFrom: string;
    visibleUntil?: string | null;
    enabled: boolean;
    label?: string;
  }[];
  onCheckin?: () => void;
  onMovementStart?: () => void;
}) {
  const now = new Date();
  const visible = actions.filter((a) => {
    const from = new Date(a.visibleFrom);
    const until = a.visibleUntil ? new Date(a.visibleUntil) : null;
    return now >= from && (!until || now <= until);
  });
  const primary = visible[0];
  if (!primary) return null;
  switch (primary.kind) {
    case "checkin":
      return (
        <View style={{ marginTop: 4 }}>
          <Button
            title={primary.label ?? "Check-in"}
            size="sm"
            onPress={onCheckin}
            accessibilityLabel={`checkin-${goalId}`}
            testID={`checkin-${goalId}`}
            disabled={!primary.enabled}
          />
        </View>
      );
    case "movement_start":
      return (
        <View style={{ marginTop: 4 }}>
          <Button
            title={primary.label ?? "Start timer"}
            size="sm"
            onPress={onMovementStart}
            accessibilityLabel={`movement-start-${goalId}`}
            testID={`movement-start-${goalId}`}
            disabled={!primary.enabled}
          />
        </View>
      );
    default:
      return null;
  }
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
