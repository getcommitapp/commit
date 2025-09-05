import { Pressable, StyleSheet, View } from "react-native";
import { CardList } from "@/components/ui/CardList";
import { GoalCard } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/Button";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";
import { useRouter } from "expo-router";
import { useGoals } from "@/lib/hooks/useGoals";
import { useMemo } from "react";
import { StatusLayout } from "@/components/layouts/StatusLayout";

export default function HomeScreen() {
  const router = useRouter();
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const { data: goals, refetch } = useGoals();
  const hasGoals = goals && goals.length > 0;

  const totalDisplay = useMemo(() => {
    const activeStates = [
      "scheduled",
      "window_open",
      "ongoing",
      "awaiting_verification",
    ];
    const totalsByCurrency = (goals ?? [])
      .filter((g) => !g.state || activeStates.includes(g.state))
      .reduce<Record<string, number>>((acc, g) => {
        acc[g.currency] = (acc[g.currency] ?? 0) + g.stakeCents;
        return acc;
      }, {});
    return Object.entries(totalsByCurrency)
      .map(([cur, cents]) => `${cur} ${(cents / 100).toFixed(2)}`)
      .join("  ");
  }, [goals]);

  const WelcomeMessage = () => {
    return (
      <View>
        <View>
          <ThemedText style={styles.title}>Welcome back 👋</ThemedText>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <ThemedText style={[textVariants.title1, { fontWeight: "700" }]}>
            {hasGoals ? totalDisplay : "Nothing"}{" "}
          </ThemedText>
          <ThemedText
            style={[
              textVariants.title1,
              { color: mutedForeground, fontWeight: "400" },
            ]}
          >
            {hasGoals ? "are at stake!" : "is at stake!"}
          </ThemedText>
        </View>
      </View>
    );
  };

  const ActionButtons = () => {
    return (
      <View style={{ gap: spacing.sm }}>
        <Button
          title="New Goal"
          size="lg"
          onPress={async () => {
            router.push("/(tabs)/goals");
            setTimeout(() => {
              router.push("/(tabs)/goals/create");
            }, 25);
          }}
        />
        <Button
          title="New Group"
          variant="border"
          size="lg"
          onPress={async () => {
            router.push("/(tabs)/groups");
            setTimeout(() => {
              router.push("/(tabs)/groups/create");
            }, 25);
          }}
        />
        <Button
          title="Join Group"
          variant="border"
          size="lg"
          onPress={async () => {
            router.push("/(tabs)/groups");
            setTimeout(() => {
              router.push("/(tabs)/groups/join");
            }, 25);
          }}
        />
      </View>
    );
  };

  if (!hasGoals) {
    return (
      <>
        <StatusLayout
          largeTitle
          style={{
            gap: spacing.xl,
            paddingTop: spacing.md,
          }}
          status="empty"
          title="No goals yet"
          message="Create a goal or create/join a group to get started!"
          onRefresh={refetch}
          preContent={<WelcomeMessage />}
          postContent={<ActionButtons />}
        ></StatusLayout>
      </>
    );
  }

  return (
    <ScreenLayout
      largeTitle
      style={{
        gap: spacing.xl,
        paddingTop: spacing.md,
      }}
      onRefresh={refetch}
    >
      <WelcomeMessage />

      <View style={{ gap: spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText style={textVariants.title3}>Active Goals</ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/goals")}
          >
            <ThemedText style={[textVariants.subheadlineEmphasized]}>
              View All
            </ThemedText>
          </Pressable>
        </View>

        <CardList>
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </CardList>
        <ActionButtons />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    ...textVariants.largeTitle,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
});
