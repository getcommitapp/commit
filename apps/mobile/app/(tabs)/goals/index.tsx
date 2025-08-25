import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Text,
  spacing,
  radii,
  textVariants,
  useThemeColor,
} from "@/components/Themed";

type GoalStatus = "active" | "expired" | "upcoming" | "finished";
type Goal = {
  id: string;
  title: string;
  amountCHF: number;
  status: GoalStatus;
  timeLeftHours?: number; // only for active goals
  groupName?: string; // if part of a group
  streak?: number; // flame icon count
};

const STATIC_GOALS: Goal[] = [
  {
    id: "1",
    title: "Morning Workout",
    amountCHF: 50,
    status: "active",
    timeLeftHours: 2,
    groupName: "Morning Warriors",
    streak: 2,
  },
  {
    id: "2",
    title: "Run 2 km",
    amountCHF: 20,
    status: "active",
    timeLeftHours: 6,
    streak: 10,
  },
  {
    id: "3",
    title: "Stay at school for 3 hours",
    amountCHF: 40,
    status: "active",
    timeLeftHours: 2,
    groupName: "School Friends",
  },
  { id: "4", title: "Morning Workout", amountCHF: 50, status: "expired" },
  { id: "5", title: "Run 2 km", amountCHF: 20, status: "upcoming" },
  { id: "6", title: "Stay at school for 3 hours", amountCHF: 40, status: "expired" },
  { id: "7", title: "Morning Workout", amountCHF: 50, status: "finished", streak: 2 },
  {
    id: "8",
    title: "Run 2 km",
    amountCHF: 20,
    status: "active",
    timeLeftHours: 6,
    streak: 10,
  },
  {
    id: "9",
    title: "Stay at school for 3 hours",
    amountCHF: 40,
    status: "active",
    timeLeftHours: 2,
  },
  {
    id: "10",
    title: "Morning Workout",
    amountCHF: 50,
    status: "active",
    timeLeftHours: 2,
    streak: 2,
  },
  {
    id: "11",
    title: "Run 2 km",
    amountCHF: 20,
    status: "active",
    timeLeftHours: 6,
    streak: 10,
  },
];

export default function GoalsScreen() {
  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const danger = useThemeColor({}, "danger");
  const success = useThemeColor({}, "success");
  const warning = useThemeColor({}, "warning");

  const data = useMemo(() => STATIC_GOALS, []);

  const renderStatus = (goal: Goal) => {
    switch (goal.status) {
      case "active": {
        if (goal.timeLeftHours == null) return null;
        const urgent = goal.timeLeftHours <= 2;
        return (
          <Text
            style={{
              color: urgent ? danger : warning,
              ...textVariants.footnoteEmphasized,
            }}
          >
            {goal.timeLeftHours}h left
          </Text>
        );
      }
      case "expired":
        return (
          <Text style={{ color: danger, ...textVariants.footnoteEmphasized }}>
            expired
          </Text>
        );
      case "upcoming":
        return (
          <Text
            style={{ color: mutedForeground, ...textVariants.footnoteEmphasized }}
          >
            upcoming
          </Text>
        );
      case "finished":
        return (
          <Text style={{ color: success, ...textVariants.footnoteEmphasized }}>
            finished
          </Text>
        );
      default:
        return null;
    }
  };

  const renderRow = (item: Goal, index: number) => {
    const showTopBorder = index !== 0;
    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          styles.row,
          showTopBorder && {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: border,
          },
          pressed && { opacity: 0.6 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={styles.rowLeft}>
          <Text style={[textVariants.subheadlineEmphasized]}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Text
              style={{
                color: mutedForeground,
                ...textVariants.footnoteEmphasized,
              }}
            >
              CHF {item.amountCHF}
            </Text>
            <Text style={[styles.metaSeparator, { color: mutedForeground }]}>|</Text>
            {renderStatus(item)}
          </View>
        </View>
        <View style={styles.rowRight}>
          {item.groupName && (
            <Text
              numberOfLines={1}
              style={{ ...textVariants.calloutEmphasized }}
            >
              {"\u2022"} {item.groupName}
            </Text>
          )}
          {!item.groupName && !!item.streak && (
            <View style={styles.streakRow}>
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text style={{ ...textVariants.calloutEmphasized }}> {item.streak}</Text>
            </View>
          )}
          {item.groupName && !!item.streak && (
            <View style={[styles.streakRow, { marginTop: spacing.xs }]}> 
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text style={{ ...textVariants.calloutEmphasized }}> {item.streak}</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.lg + spacing.md, // space below large title
          paddingBottom: spacing.xxl,
        }}
      >
        <View
          style={{
            backgroundColor: card,
            borderRadius: radii.lg,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          {data.map(renderRow)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    backgroundColor: "transparent",
  },
  rowLeft: { flex: 1 },
  rowRight: { alignItems: "flex-end", maxWidth: 150 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaSeparator: { opacity: 0.6 },
  streakRow: { flexDirection: "row", alignItems: "center" },
});

