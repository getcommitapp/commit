import React, { useState, useRef, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View as RNView, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, spacing, textVariants, useThemeColor, radii } from "@/components/Themed";
import { ROUTES } from "@/constants/routes";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import GoalDetailContent, { Goal as FullGoal } from "@/components/goals/GoalDetailSheet";

type Goal = {
  id: string;
  title: string;
  stake: string; // e.g. CHF 50
  timeLeft: string; // e.g. 2h left
  streak?: number; // optional flame count
};

const mockGoals: Goal[] = [
  { id: "1", title: "Morning Workout", stake: "CHF 50", timeLeft: "2h left", streak: 2 },
  { id: "2", title: "Run 2 km", stake: "CHF 20", timeLeft: "6h left", streak: 10 },
  { id: "3", title: "Stay at school for 3 hours", stake: "CHF 40", timeLeft: "2h left" },
];

function GoalCard({ goal, isFirst, isLast }: { goal: Goal; isFirst: boolean; isLast: boolean }) {
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const danger = useThemeColor({}, "danger");

  return (
    <RNView
      style={{
        backgroundColor: card,
        borderColor: border,
        borderWidth: 1,
        borderTopWidth: isFirst ? 1 : 0,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: isFirst ? radii.md : 0,
        borderTopRightRadius: isFirst ? radii.md : 0,
        borderBottomLeftRadius: isLast ? radii.md : 0,
        borderBottomRightRadius: isLast ? radii.md : 0,
      }}
    >
      <RNView style={{ flex: 1 }}>
        <Text style={[textVariants.bodyEmphasized]} numberOfLines={1}>
          {goal.title}
        </Text>
        <RNView style={{ flexDirection: "row", gap: spacing.xs, marginTop: 2 }}>
          <Text style={[textVariants.caption1Emphasized]}>{goal.stake}</Text>
          <Text style={[textVariants.caption1, { color: mutedForeground }]}>|</Text>
          <Text style={[textVariants.caption1Emphasized, { color: danger }]}>{goal.timeLeft}</Text>
        </RNView>
      </RNView>
      {goal.streak !== undefined ? (
        <RNView style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text accessibilityLabel="streak" style={[textVariants.caption1Emphasized, { color: danger }]}>🔥</Text>
          <Text style={[textVariants.subheadlineEmphasized]}>{goal.streak}</Text>
        </RNView>
      ) : null}
    </RNView>
  );
}

export default function HomeScreen() {
  const background = useThemeColor({}, "background");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const primary = useThemeColor({}, "primary");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const [selected, setSelected] = useState<Goal | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%", "85%"], []);

  const openGoal = useCallback((g: Goal) => {
    setSelected(g);
    requestAnimationFrame(() => sheetRef.current?.expand());
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxl * 2,
          gap: spacing.xl,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <RNView style={{ marginTop: spacing.xl }}>
          <Text style={styles.title}>
            Welcome back <Text style={{ fontSize: styles.title.fontSize }}>👋</Text>
          </Text>
          <RNView style={{ flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm }}>
            <Text style={[textVariants.title1, { fontWeight: "700" }]}>CHF 250 </Text>
            <Text style={[textVariants.title1, { color: mutedForeground, fontWeight: "400" }]}>are at stake!</Text>
          </RNView>
        </RNView>

        <RNView style={{ gap: spacing.md }}>
          <RNView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={textVariants.title3}>Active Goals</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(ROUTES.GOALS_INDEX as any)}
            >
              <Text style={[textVariants.subheadlineEmphasized, { color: primary }]}>View All</Text>
            </Pressable>
          </RNView>

            <RNView style={{ borderRadius: radii.md, overflow: "hidden" }}>
              {mockGoals.map((g, idx) => (
                <Pressable
                  key={g.id}
                  accessibilityRole="button"
                  onPress={() => openGoal(g)}
                >
                  <GoalCard
                    goal={g}
                    isFirst={idx === 0}
                    isLast={idx === mockGoals.length - 1}
                  />
                </Pressable>
              ))}
            </RNView>
        </RNView>

        <RNView style={{ gap: spacing.sm }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: ROUTES.HOME_GOAL_CREATE as any, params: { origin: 'home' } })}
            style={({ pressed }) => [
              styles.primaryAction,
              { opacity: pressed ? 0.9 : 1, backgroundColor: primary },
            ]}
          >
            <Text style={[textVariants.subheadlineEmphasized, { color: card }]}>+  Create Goal</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryAction,
              { opacity: pressed ? 0.9 : 1, backgroundColor: background, borderColor: border },
            ]}
            onPress={() => router.push({ pathname: ROUTES.HOME_GROUP_CREATE as any, params: { origin: 'home' } })}
          >
            <Text style={[textVariants.subheadlineEmphasized]}>+  Create Group</Text>
          </Pressable>
        </RNView>
      </ScrollView>
      {selected && (
        <BottomSheet
          ref={sheetRef}
          index={0}
          enablePanDownToClose
          snapPoints={snapPoints}
          onChange={(i) => { if (i === -1) setSelected(null); }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <GoalDetailContent goal={{
              id: selected.id,
              title: selected.title,
              amountCHF: parseInt(selected.stake.replace(/[^0-9]/g, '')),
              status: 'active',
              timeLeftHours: parseInt(selected.timeLeft) || 2,
              streak: selected.streak,
            } as FullGoal} />
          </BottomSheetView>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...textVariants.largeTitle,
    marginBottom: spacing.xs,
  },
  primaryAction: {
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryAction: {
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
