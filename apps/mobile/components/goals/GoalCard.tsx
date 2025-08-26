import React, { useMemo, useRef, useCallback } from "react";
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
import GoalDetailsSheet from "./GoalDetailsSheet";

export type Goal = {
  id: string;
  title: string;
  stake: string; // e.g. CHF 50
  timeLeft: string; // e.g. 2h left
  streak?: number; // optional flame count
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
  const snapPoints = useMemo(() => ["40%", "75%"], []);
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
        <Text style={{ ...textVariants.footnote, color: mutedForeground }}>
          {goal.timeLeft}
        </Text>
        {goal.streak && (
          <>
            <Text
              style={{
                ...textVariants.subheadline,
                color: mutedForeground,
                marginHorizontal: 4,
                fontWeight: "bold",
              }}
            >
              &middot;
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <Flame width={14} height={14} color={danger} />
              <Text
                style={{
                  ...textVariants.footnoteEmphasized,
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
    </View>
  );

  const rightNode = (
    <View style={{ alignItems: "flex-end", gap: 2, marginLeft: spacing.lg }}>
      <ThemedText style={{ ...textVariants.bodyEmphasized }}>
        {goal.stake}
      </ThemedText>
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

      <GoalDetailsSheet
        ref={bottomSheetRef}
        goal={goal}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      />
    </>
  );
}
