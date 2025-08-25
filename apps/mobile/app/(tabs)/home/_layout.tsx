import { Stack } from "expo-router";
import React from "react";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{ title: "Create Solo Goal" }}
      />
      <Stack.Screen
        name="create-step2"
        options={{ title: "Create Solo Goal" }}
      />
      <Stack.Screen
        name="configure"
        options={{ title: "Create Solo Goal" }}
      />
    </Stack>
  );
}
