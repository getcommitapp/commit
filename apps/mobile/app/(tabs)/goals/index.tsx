import CardList from "@/components/ui/CardList";
import GoalCard from "@/components/goals/GoalCard";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useGoals } from "@/lib/hooks/useGoals";
import { ActivityIndicator, Text, View } from "react-native";
import { ThemedText, textVariants, useThemeColor } from "@/components/Themed";

export default function GoalsScreen() {
  const { data: goals, isLoading, error } = useGoals();
  const errorColor = useThemeColor({}, "danger");

  if (isLoading) {
    return (
      <ScreenLayout>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <ThemedText style={{ ...textVariants.body, marginTop: 16 }}>
            Loading goals...
          </ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              ...textVariants.body,
              color: errorColor,
              textAlign: "center",
            }}
          >
            Failed to load goals. Please try again.
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <ScreenLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ThemedText style={{ ...textVariants.body, textAlign: "center" }}>
            No goals found. Create your first goal to get started!
          </ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout largeTitle>
      <CardList>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </CardList>
    </ScreenLayout>
  );
}
