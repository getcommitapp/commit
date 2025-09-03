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
import { GoalDetails } from "@/components/goals/GoalDetails";

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

  // Check if goal is in an active state that prevents deletion/leaving
  const activeStates = [
    "scheduled",
    "window_open",
    "ongoing",
    "awaiting_verification",
  ];
  const isGoalInActiveState =
    group.goal && activeStates.includes(group.goal.state);
  const canLeaveOrDelete = !isGoalInActiveState;

  const handleLeaveGroup = () => {
    if (canLeaveOrDelete) {
      leaveOrDelete(group.id);
    }
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
          group.members.map(
            (m: { name: string; isOwner: boolean }, idx: number) => (
              <FormItem
                key={idx}
                label={
                  m.isOwner
                    ? group.isOwner
                      ? "Owner (You)"
                      : "Owner"
                    : "Member"
                }
                value={m.name}
              />
            )
          )
        ) : (
          <FormItem label="Members" value="—" />
        )}
      </FormGroup>

      <GoalDetails goal={group.goal ?? null} title="Goal" />

      <Button
        title={group.isOwner ? "Delete group" : "Leave group"}
        onPress={handleLeaveGroup}
        variant="danger"
        accessibilityLabel={group.isOwner ? "delete-group" : "leave-group"}
        testID={group.isOwner ? "delete-group" : "leave-group"}
        loading={isPending}
        disabled={!canLeaveOrDelete}
      />
    </DetailsSheet>
  );
});

GroupDetailsSheet.displayName = "GroupDetailsSheet";
