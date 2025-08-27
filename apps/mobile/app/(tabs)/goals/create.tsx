import React from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Card from "@/components/ui/Card";
import CardList from "@/components/ui/CardList";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  spacing,
  ThemedText,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import { SmallText } from "@/components/ui/SmallText";

export default function GoalCreateChoiceScreen() {
  const router = useRouter();
  const muted = useThemeColor({}, "muted");

  return (
    <ScreenLayout>
      <SmallText>Custom Goal</SmallText>

      <CardList>
        <Pressable
          onPress={() => router.push("/(tabs)/goals/create/custom")}
          accessibilityLabel="choose-custom-goal"
          testID="choose-custom-goal"
        >
          <Card
            left={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: muted,
                  }}
                  accessibilityLabel="custom-goal-icon"
                />
                <View style={{ gap: 4 }}>
                  <ThemedText style={textVariants.bodyEmphasized}>
                    Custom Goal
                  </ThemedText>
                  <ThemedText style={textVariants.footnote}>
                    Create your own goal
                  </ThemedText>
                </View>
              </View>
            }
            right={""}
          />
        </Pressable>
      </CardList>

      <View style={{ height: spacing.xl }} />

      <SmallText>Goal Templates</SmallText>

      <CardList>
        <Pressable
          onPress={() => router.push("/(tabs)/goals/create/new")}
          accessibilityLabel="choose-wake-up-goal"
          testID="choose-wake-up-goal"
        >
          <Card
            left={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: muted,
                  }}
                  accessibilityLabel="wake-up-goal-icon"
                />
                <View style={{ gap: 4 }}>
                  <ThemedText style={textVariants.bodyEmphasized}>
                    Wake Up Goal
                  </ThemedText>
                  <ThemedText style={textVariants.footnote}>
                    Prove you wake up at a specific time
                  </ThemedText>
                </View>
              </View>
            }
            right={""}
          />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/goals/create/new")}
          accessibilityLabel="choose-no-phone-goal"
          testID="choose-no-phone-goal"
        >
          <Card
            left={
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: muted,
                  }}
                  accessibilityLabel="no-phone-goal-icon"
                />
                <View style={{ gap: 4 }}>
                  <ThemedText style={textVariants.bodyEmphasized}>
                    No-Phone Goal
                  </ThemedText>
                  <ThemedText style={textVariants.footnote}>
                    Do not use your phone for a set duration
                  </ThemedText>
                </View>
              </View>
            }
            right={""}
          />
        </Pressable>
      </CardList>
    </ScreenLayout>
  );
}
