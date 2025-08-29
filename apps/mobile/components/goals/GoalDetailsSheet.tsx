import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useThemeColor } from "@/components/Themed";
import type { Goal } from "@/components/goals/GoalCard";
import { FormGroup, FormItem } from "@/components/ui/form";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import { useGoalTimer, useStartGoalTimer } from "@/lib/hooks/useGoalTimer";
import { ThemedText, textVariants } from "@/components/Themed";
import { Pressable, View } from "react-native";

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
    const primary = useThemeColor({}, "primary");
    const { data: timer } = useGoalTimer(goal.id);
    const { mutate: startTimer, isPending } = useStartGoalTimer(goal.id);

    // Force a tick every second to update the elapsed label
    const [tick, setTick] = useState(0);
    useEffect(() => {
      if (!timer?.startedAt) return; // only tick when running
      const id = setInterval(() => setTick((t) => (t + 1) % 1_000_000), 1000);
      return () => clearInterval(id);
    }, [timer?.startedAt]);

  const elapsed = useMemo(() => {
      if (!timer?.startedAt) return null;
      const start = new Date(timer.startedAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, [timer?.startedAt, tick]);

    return (
      <DetailsSheet
        ref={ref}
        title={goal.title}
        description={goal.description}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
        actionButton={
          timer
            ? undefined
            : onDelete
            ? {
                label: "Delete Goal",
                onPress: () => onDelete(goal),
                variant: "danger",
              }
            : undefined
        }
      >
        <FormGroup title="Progress" backgroundStyle={{ backgroundColor: background }}>
          {timer ? (
            <View style={{ gap: 6 }}>
              <ThemedText style={textVariants.subheadline}>Running</ThemedText>
              {elapsed && (
                <ThemedText style={textVariants.title2}>{elapsed}</ThemedText>
              )}
            </View>
          ) : (
            <View>
              <ThemedText style={textVariants.subheadline}>
                Timer not started
              </ThemedText>
              {/* Simple inline button since DetailsSheet has a single footer action slot */}
              <View style={{ height: 12 }} />
              <Pressable
                style={{
                  backgroundColor: primary,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                accessibilityRole="button"
                accessibilityLabel="start-goal-timer"
                onPress={() => !isPending && startTimer()}
              >
                <ThemedText
                  style={{ ...textVariants.bodyEmphasized, color: "white" }}
                >
                  {isPending ? "Starting…" : "Start Timer"}
                </ThemedText>
              </Pressable>
            </View>
          )}
        </FormGroup>
        <FormGroup
          title="Details"
          backgroundStyle={{ backgroundColor: background }}
        >
          <FormItem label="Stake" value={goal.stake} />
          <FormItem label="Time Left" value={goal.timeLeft} />
          <FormItem label="Start Date" value={goal.startDate} />
          <FormItem label="End Date" value={goal.endDate} />
          <FormItem label="Frequency" value="Daily" />
          <FormItem label="Category" value="Fitness" />
        </FormGroup>
      </DetailsSheet>
    );
  }
);

GoalDetailsSheet.displayName = "GoalDetailsSheet";
