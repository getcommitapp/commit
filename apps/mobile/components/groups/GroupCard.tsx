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
import { GroupDetailsSheet } from "./GroupDetailsSheet";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useGroups } from "@/lib/hooks/useGroups";
import { formatStake } from "@/lib/utils";

interface GroupCardProps {
  group: NonNullable<ReturnType<typeof useGroups>["data"]>[number];
  accessibilityLabel?: string;
  testID?: string;
}

export function GroupCard({
  group,
  accessibilityLabel,
  testID,
}: GroupCardProps) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const primary = useThemeColor({}, "primary");

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
        {group.name}
      </ThemedText>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        {group.totalStake ? (
          <ThemedText style={{ ...textVariants.subheadline }}>
            {formatStake(group.goal.currency, group.totalStake)}
          </ThemedText>
        ) : null}
        {group.totalStake && group.goal.timeLeft ? (
          <Text
            style={{
              ...textVariants.subheadline,
              color: mutedForeground,
              marginHorizontal: 4,
            }}
          >
            &middot;
          </Text>
        ) : null}
        {group.goal.timeLeft ? (
          <Text style={{ ...textVariants.subheadline, color: mutedForeground }}>
            {group.goal.timeLeft}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const rightNode = (
    <View style={{ alignItems: "flex-end", gap: 2, marginLeft: spacing.lg }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}
      >
        <IonIcons name="people" size={16} color={primary} />
        <Text
          style={{
            ...textVariants.subheadlineEmphasized,
            color: mutedForeground,
          }}
          numberOfLines={1}
        >
          {group.memberCount ?? "—"}
        </Text>
      </View>
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
            `Group ${group.name}` +
              (group.totalStake ? `, ${group.totalStake}` : "") +
              (group.memberCount !== undefined
                ? `, ${group.memberCount} members`
                : "") +
              (group.goal.timeLeft ? `, ${group.goal.timeLeft}` : "")
          }
          testID={testID}
        />
      </Pressable>

      <GroupDetailsSheet ref={bottomSheetRef} group={group} />
    </>
  );
}
