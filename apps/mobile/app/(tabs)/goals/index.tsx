import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, Pressable, Platform } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, spacing, radii, textVariants, useThemeColor } from "@/components/Themed";
import GoalDetailContent, { Goal } from "@/components/goals/GoalDetailSheet";

// Goal type now imported from shared component

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
  // bottom sheet state
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["55%", "85%"], []);

  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const danger = useThemeColor({}, "danger");
  const success = useThemeColor({}, "success");
  const warning = useThemeColor({}, "warning");
  const background = useThemeColor({}, "background");
  const accent = useThemeColor({}, "accent");

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

  const openSheet = useCallback((goal: Goal) => {
    setSelectedGoal(goal);
    // open to first snap point
    requestAnimationFrame(() => sheetRef.current?.expand());
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) setSelectedGoal(null);
  }, []);

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
        onPress={() => openSheet(item)}
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
      {/* Bottom Sheet Overlay */}
      {selectedGoal && (
        <BottomSheet
          ref={sheetRef}
          index={0}
          enablePanDownToClose
          onChange={handleSheetChange}
          snapPoints={snapPoints}
          handleIndicatorStyle={{ backgroundColor: mutedForeground }}
          backgroundStyle={{ backgroundColor: card }}
          style={{ zIndex: 100 }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <GoalDetailContent goal={selectedGoal} origin="goals" />
          </BottomSheetView>
        </BottomSheet>
      )}
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
  sheetTwoColWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: spacing.xl,
    rowGap: spacing.lg,
  },
  sheetField: { width: "45%" },
  sheetLabel: {
    ...textVariants.subheadline,
    fontWeight: "400",
    marginBottom: spacing.xs / 2,
  },
  verifyButton: {
    marginTop: spacing.xxl,
    borderRadius: radii.lg,
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: spacing.xl,
  },
});



