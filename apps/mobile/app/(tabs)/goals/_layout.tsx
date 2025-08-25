import { Stack } from "expo-router";
import React from "react";
import { Pressable, Platform } from "react-native";
import { Text, spacing } from "@/components/Themed";
import { useThemeColor } from "@/components/Themed";

export default function GoalsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: Platform.OS === "ios",
        headerTransparent: Platform.OS === "ios", // non-transparent on Android to avoid overlap
        headerShadowVisible: false,
        headerStyle: { backgroundColor },
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Goals",
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add goal"
              hitSlop={8}
              onPress={() => {}}
              style={{ paddingHorizontal: spacing.sm }}
            >
              <Text style={{ fontSize: 30, fontWeight: "400" }}>+</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
