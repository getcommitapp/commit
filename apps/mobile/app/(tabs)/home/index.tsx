import { ScrollView, StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardList from "@/components/ui/CardList";
import GoalCard, { Goal } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/Button";

import {
  ThemedText,
  spacing,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import { useRouter } from "expo-router";

// Goal type imported from GoalCard

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Morning Workout",
    stake: "CHF 50",
    timeLeft: "2h left",
    streak: 2,
  },
  {
    id: "2",
    title: "Run 2 km",
    stake: "CHF 20",
    timeLeft: "6h left",
    streak: 10,
  },
  {
    id: "3",
    title: "Stay at school for 3 hours",
    stake: "CHF 40",
    timeLeft: "2h left",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const mutedForeground = useThemeColor({}, "mutedForeground");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.md,
          gap: spacing.xl,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
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
              CHF 250{" "}
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
            {mockGoals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </CardList>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Button
            title="Create Goal"
            size="lg"
            onPress={() => router.push("/(tabs)/goals")}
          />
          <Button
            title="Create Group"
            variant="border"
            size="lg"
            onPress={() => router.push("/(tabs)/groups")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...textVariants.largeTitle,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
});
