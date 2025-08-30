import React, { forwardRef } from "react";
import { Text, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { textVariants, spacing, useThemeColor } from "@/components/Themed";
import { FormGroup, FormItem } from "@/components/ui/form";
import { DetailsSheet } from "@/components/ui/DetailsSheet";
import PeopleCircle from "@/assets/icons/people-circle.svg";
import { useGroups } from "@/lib/hooks/useGroups";
import { formatStake } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useLeaveOrDeleteGroup } from "@/lib/hooks/useLeaveOrDeleteGroup";

interface GroupDetailsSheetProps {
  group: NonNullable<ReturnType<typeof useGroups>["data"]>[number];
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

  const { mutate: leaveOrDelete, isPending } = useLeaveOrDeleteGroup({
    isOwner: group.isOwner,
  });

  const handleLeaveGroup = () => {
    leaveOrDelete(group.id);
  };

  return (
    <DetailsSheet
      ref={ref}
      title={group.name}
      description={group.description}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      onDismiss={onDismiss}
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
          {group.memberCount !== undefined
            ? `${group.memberCount} member${group.memberCount !== 1 ? "s" : ""}`
            : "Members unknown"}{" "}
          in this group
        </Text>
      </View>
      <FormGroup
        title="Details"
        backgroundStyle={{ backgroundColor: background }}
      >
        <FormItem
          label="Total Stake"
          value={formatStake(group.goal.currency, group.totalStake ?? 0)}
        />
        <FormItem
          label="Members"
          value={
            group.memberCount !== undefined ? group.memberCount.toString() : "—"
          }
        />
        <FormItem label="Invitation Code" value={group.inviteCode} />
      </FormGroup>

      <FormGroup
        title="Members"
        backgroundStyle={{ backgroundColor: background }}
      >
        {group.members && group.members.length > 0 ? (
          group.members.map((m, idx) => (
            <FormItem
              key={idx}
              label={
                m.isOwner ? (group.isOwner ? "Owner (You)" : "Owner") : "Member"
              }
              value={m.name}
            />
          ))
        ) : (
          <FormItem label="Members" value="—" />
        )}
      </FormGroup>

      <FormGroup title="Goal" backgroundStyle={{ backgroundColor: background }}>
        {group.goal ? (
          <>
            <FormItem label="Title" value={group.goal.name} />
            <FormItem
              label="Stake"
              value={formatStake(
                group.goal.currency,
                group.goal.stakeCents ?? 0
              )}
            />
            <FormItem label="Time Left" value={group.goal.timeLeft ?? "—"} />
            <FormItem label="Start Date" value={group.goal.startDate ?? "—"} />
            <FormItem label="End Date" value={group.goal.endDate ?? "—"} />
            <FormItem
              label="Due Start Time"
              value={group.goal.dueStartTime ?? "—"}
            />
            <FormItem
              label="Due End Time"
              value={group.goal.dueEndTime ?? "—"}
            />
            {/* {group.goal.streak !== undefined ? (
              <FormItem label="Streak" value={group.goal.streak.toString()} />
            ) : (
              <FormItem label="Streak" value="—" />
            )} */}
          </>
        ) : (
          <FormItem label="Status" value="No goal linked" />
        )}
      </FormGroup>

      <Button
        title={group.isOwner ? "Delete group" : "Leave group"}
        onPress={handleLeaveGroup}
        variant="danger"
        accessibilityLabel={group.isOwner ? "delete-group" : "leave-group"}
        testID={group.isOwner ? "delete-group" : "leave-group"}
        loading={isPending}
      />
    </DetailsSheet>
  );
});

GroupDetailsSheet.displayName = "GroupDetailsSheet";
