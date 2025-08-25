import { Stack, router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Text, spacing, useThemeColor } from "@/components/Themed";

export default function GroupsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Groups",
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.push("/(tabs)/groups/create" as any)}
              style={{ paddingHorizontal: spacing.sm }}
            >
              <Text style={{ fontSize: 30, fontWeight: "400" }}>+</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create Group",
          headerLargeTitle: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: "Verify Goal",
          headerLargeTitle: false,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
