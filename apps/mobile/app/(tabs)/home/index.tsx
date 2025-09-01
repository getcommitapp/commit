import { StyleSheet, Pressable, View } from "react-native";
import { CardList } from "@/components/ui/CardList";
import { GoalCard } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/Button";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

import {
  ThemedText,
  spacing,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import { useRouter } from "expo-router";
import { useGoals } from "@/lib/hooks/useGoals";
import { useMemo } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const { data: goals } = useGoals();

  const totalDisplay = useMemo(() => {
    const totalsByCurrency = (goals ?? []).reduce<Record<string, number>>(
      (acc, g) => {
        acc[g.currency] = (acc[g.currency] ?? 0) + g.stakeCents;
        return acc;
      },
      {}
    );
    return Object.entries(totalsByCurrency)
      .map(([cur, cents]) => `${cur} ${(cents / 100).toFixed(2)}`)
      .join("  ");
  }, [goals]);

  return (
    <ScreenLayout style={{ gap: spacing.xl }}>
      <View>
        <ThemedText style={styles.title}>
          Welcome back{" "}
          <ThemedText style={{ fontSize: styles.title.fontSize }}>
            👋
          </ThemedText>
        </ThemedText>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <ThemedText style={[textVariants.title1, { fontWeight: "700" }]}>
            {totalDisplay || "–"}{" "}
          </ThemedText>
          <ThemedText
            style={[
              textVariants.title1,
              { color: mutedForeground, fontWeight: "400" },
            ]}
          >
            are at stake!
          </ThemedText>
        </View>
      </View>

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
          {(goals ?? []).map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </CardList>
      </View>
      <View style={{ gap: spacing.sm }}>
        <Button
          title="New Goal"
          size="lg"
          onPress={async () => {
            await router.push("/(tabs)/goals");
            router.push("/(tabs)/goals/create");
          }}
        />
        <Button
          title="New Group"
          variant="border"
          size="lg"
          onPress={async () => {
            await router.push("/(tabs)/groups");
            router.push("/(tabs)/groups/create");
          }}
        />
        <Button
          title="Join Group"
          variant="border"
          size="lg"
          onPress={async () => {
            await router.push("/(tabs)/groups");
            router.push("/(tabs)/groups/join");
          }}
        />
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
