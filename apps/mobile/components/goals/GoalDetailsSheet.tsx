import React, { forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useThemeColor } from "@/components/Themed";
import type { Goal } from "@/components/goals/GoalCard";
import { FormGroup, FormItem } from "@/components/ui/form";
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
