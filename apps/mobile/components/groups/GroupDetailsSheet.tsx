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

  const handleLeaveGroup = () => {
    // TODO: integrate with API to leave the group
    console.log("Leaving group", group.id);
  };

  return (
    <DetailsSheet
      ref={ref}
      title={group.title}
      description={group.description}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      onDismiss={onDismiss}
      actionButton={{
        label: "Leave group",
        onPress: handleLeaveGroup,
        variant: "danger",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          marginBottom: spacing.xl,
        }}
      >
        <PeopleCircle width={20} height={20} color={primary} />
        <Text style={{ ...textVariants.subheadline, color: mutedForeground }}>
          {group.memberCount} member{group.memberCount !== 1 ? "s" : ""} in this
          group
        </Text>
      </View>
      <SettingsGroup
        title="Group Details"
        backgroundStyle={{ backgroundColor: background }}
      >
        <SettingsRow label="Total Stake" value={group.totalStake} />
        <SettingsRow label="Members" value={group.memberCount.toString()} />
        <SettingsRow label="Time Left" value={group.timeLeft} />
        <SettingsRow label="Start Date" value={group.startDate} />
        <SettingsRow label="End Date" value={group.endDate} />
        <SettingsRow label="Invitation Code" value={group.invitationCode} />
      </SettingsGroup>

      <SettingsGroup
        title="Goal"
        backgroundStyle={{ backgroundColor: background }}
      >
        <SettingsRow label="Title" value={group.goal.title} />
        <SettingsRow label="Stake" value={group.goal.stake} />
        <SettingsRow label="Time Left" value={group.goal.timeLeft} />
        <SettingsRow label="Start Date" value={group.goal.startDate} />
        <SettingsRow label="End Date" value={group.goal.endDate} />
        {group.goal.streak !== undefined ? (
          <SettingsRow
            label="Streak"
            value={group.goal.streak?.toString()}
            last
          />
        ) : (
          <SettingsRow label="Streak" value="—" last />
        )}
      </SettingsGroup>
    </DetailsSheet>
  );
});

GroupDetailsSheet.displayName = "GroupDetailsSheet";
