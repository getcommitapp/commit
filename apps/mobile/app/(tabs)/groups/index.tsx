import React, { useMemo, useState, useRef, useCallback } from "react";
import { ScrollView, View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  spacing,
  useThemeColor,
  textVariants,
  radii,
} from "@/components/Themed";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import GroupDetailContent, { Group as FullGroup } from "@/components/groups/GroupDetailSheet";

type Group = {
  id: string;
  name: string;
  amountCHF: number;
  timeLeftLabel: string;
  timeLeftVariant: "urgent" | "warning" | "muted";
  streak?: number;
};

const GROUPS: Group[] = [
  { id: "g1", name: "Morning Warriors", amountCHF: 50, timeLeftLabel: "2h left", timeLeftVariant: "urgent", streak: 2 },
  { id: "g2", name: "Friends", amountCHF: 20, timeLeftLabel: "6h left", timeLeftVariant: "warning", streak: 10 },
  { id: "g3", name: "Gym bros", amountCHF: 40, timeLeftLabel: "Starts in 3 days", timeLeftVariant: "muted" },
  { id: "g4", name: "Morning Warriors", amountCHF: 50, timeLeftLabel: "2h left", timeLeftVariant: "urgent", streak: 2 },
  { id: "g5", name: "Friends", amountCHF: 20, timeLeftLabel: "6h left", timeLeftVariant: "warning", streak: 10 },
  { id: "g6", name: "Gym bros", amountCHF: 40, timeLeftLabel: "Starts in 3 days", timeLeftVariant: "muted" },
  { id: "g7", name: "Morning Warriors", amountCHF: 50, timeLeftLabel: "2h left", timeLeftVariant: "urgent", streak: 2 },
  { id: "g8", name: "Friends", amountCHF: 20, timeLeftLabel: "6h left", timeLeftVariant: "warning", streak: 10 },
  { id: "g9", name: "Gym bros", amountCHF: 40, timeLeftLabel: "Starts in 3 days", timeLeftVariant: "muted" },
];

export default function GroupsScreen() {
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const danger = useThemeColor({}, "danger");
  const warning = useThemeColor({}, "warning");
  const muted = useThemeColor({}, "mutedForeground");

  const colorForVariant = (v: Group["timeLeftVariant"]) => {
    switch (v) {
      case "urgent":
        return danger;
      case "warning":
        return warning;
      default:
        return muted;
    }
  };

  const groups = useMemo(() => GROUPS, []);
  const [selected, setSelected] = useState<Group | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const openGroup = useCallback((g: Group) => {
    setSelected(g);
    requestAnimationFrame(() => sheetRef.current?.expand());
  }, []);

  const renderRow = (g: Group, index: number) => {
    const showTopBorder = index !== 0;
    return (
      <Pressable
        key={g.id}
        accessibilityRole="button"
  onPress={() => openGroup(g)}
        style={({ pressed }) => [
          styles.row,
          showTopBorder && {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: border,
          },
          pressed && { opacity: 0.6 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={textVariants.subheadlineEmphasized}>{g.name}</Text>
          <View style={styles.metaRow}>
            <Text style={[textVariants.footnoteEmphasized, { color: muted }]}>CHF {g.amountCHF}</Text>
            <Text style={[styles.metaSeparator, { color: muted }]}>|</Text>
            <Text
              style={[
                textVariants.footnoteEmphasized,
                { color: colorForVariant(g.timeLeftVariant) },
              ]}
            >
              {g.timeLeftLabel}
            </Text>
          </View>
        </View>
        <View style={styles.rowRight}>
          {g.streak != null && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: danger }}>🔥</Text>
              <Text style={textVariants.calloutEmphasized}> {g.streak}</Text>
            </View>
          )}
          <Text style={{ fontSize: 22, marginLeft: 12, color: muted }}>›</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.lg + spacing.md, // space under large title
          paddingBottom: spacing.xxl,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
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
          {groups.map(renderRow)}
        </View>
      </ScrollView>
      {selected && (
        <BottomSheet
          ref={sheetRef}
          index={0}
          enablePanDownToClose
          snapPoints={["55%", "85%"]}
          onChange={(i) => { if (i === -1) setSelected(null); }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <GroupDetailContent group={{
              id: selected.id,
              name: selected.name,
              amountCHF: selected.amountCHF,
              startDate: "20.08.2025",
              endDate: "20.09.2025",
              description: "A group committed to daily workouts and staying fit together.",
              streak: selected.streak,
            } as FullGroup} />
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
    alignItems: "center",
    gap: spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaSeparator: { opacity: 0.6 },
  rowRight: { flexDirection: "row", alignItems: "center" },
});
