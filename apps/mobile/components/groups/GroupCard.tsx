import React, { useRef, useCallback } from "react";
import { Text, View, Pressable } from "react-native";
import Card from "@/components/ui/Card";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { GroupDetailsSheet } from "./GroupDetailsSheet";
import IonIcons from "@expo/vector-icons/Ionicons";

export type Group = {
  id: string;
  title: string;
  description: string;
  invitationCode: string; // always provided
  totalStake?: string;
  memberCount?: number;
  timeLeft?: string;
  startDate?: string;
  endDate?: string;
  goal?: {
    id: string;
    title: string;
    stake?: string;
    timeLeft?: string;
    startDate?: string;
    endDate?: string;
    streak?: number;
  };
};

interface GroupCardProps {
  group: Group;
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
        {group.title}
      </ThemedText>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        {group.totalStake ? (
          <ThemedText style={{ ...textVariants.subheadline }}>
            {group.totalStake}
          </ThemedText>
        ) : null}
        {group.totalStake && group.timeLeft ? (
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
        {group.timeLeft ? (
          <Text style={{ ...textVariants.subheadline, color: mutedForeground }}>
            {group.timeLeft}
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
            `Group ${group.title}` +
              (group.totalStake ? `, ${group.totalStake}` : "") +
              (group.memberCount !== undefined
                ? `, ${group.memberCount} members`
                : "") +
              (group.timeLeft ? `, ${group.timeLeft}` : "")
          }
          testID={testID}
        />
      </Pressable>

      <GroupDetailsSheet ref={bottomSheetRef} group={group} />
    </>
  );
}
