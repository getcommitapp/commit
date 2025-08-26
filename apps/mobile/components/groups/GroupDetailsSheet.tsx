import React, { forwardRef } from "react";
import { Text, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { textVariants, spacing, useThemeColor } from "@/components/Themed";
import type { Group } from "@/components/groups/GroupCard";
import { SettingsGroup, SettingsRow } from "@/components/ui/Settings";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import PeopleCircle from "@/assets/icons/people-circle.svg";

interface GroupDetailsSheetProps {
  group: Group;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
  onDismiss?: () => void;
}

export const GroupDetailsSheet = forwardRef<
  BottomSheetModal,
  GroupDetailsSheetProps
>(({ group, snapPoints, enableDynamicSizing = true, onDismiss }, ref) => {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const primary = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");

  return (
    <DetailsSheet
      ref={ref}
      title={group.title}
      description={group.description}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      onDismiss={onDismiss}
    >
      <SettingsGroup
        title="Group Details"
        backgroundStyle={{ backgroundColor: background }}
      >
        <SettingsRow label="Total Stake" value={group.totalStake} />
        <SettingsRow label="Members" value={group.memberCount.toString()} />
        <SettingsRow label="Time Left" value={group.timeLeft} />
        <SettingsRow label="Start Date" value={group.startDate} />
        <SettingsRow label="End Date" value={group.endDate} />
      </SettingsGroup>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        <PeopleCircle width={20} height={20} color={primary} />
        <Text style={{ ...textVariants.subheadline, color: mutedForeground }}>
          {group.memberCount} member{group.memberCount !== 1 ? "s" : ""} in this
          group
        </Text>
      </View>
    </DetailsSheet>
  );
});

GroupDetailsSheet.displayName = "GroupDetailsSheet";
