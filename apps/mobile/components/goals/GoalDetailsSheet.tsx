import React, { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useThemeColor } from "@/components/Themed";
import type { Goal } from "@/components/goals/GoalCard";
import { SettingsGroup, SettingsRow } from "@/components/ui/Settings";
import { DetailsSheet } from "@/components/ui/DetailsSheet";

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

    return (
      <DetailsSheet
        ref={ref}
        title={goal.title}
        description={goal.description}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
        actionButton={
          onDelete
            ? {
                label: "Delete Goal",
                onPress: () => onDelete(goal),
                variant: "danger",
              }
            : undefined
        }
      >
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
      </DetailsSheet>
    );
  }
);

GoalDetailsSheet.displayName = "GoalDetailsSheet";
