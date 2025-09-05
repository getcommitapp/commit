import React from "react";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { spacing } from "@/components/Themed";
import { useAuth } from "@/lib/hooks/useAuth";
import HomeIcon from "@/assets/icons/home.svg";
import TargetIcon from "@/assets/icons/target.svg";
import IonIcons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isReviewerOrAdmin } = useAuth();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarStyle: {
          borderTopWidth: 1,
        },
        sceneStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
          marginTop: -spacing.xs,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HomeIcon width={26} height={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarIcon: ({ color }) => (
            <TargetIcon width={28} height={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => (
            <IonIcons name="people-circle-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          // Hide the tab for non-reviewers/admins and prevent auto-generated unstyled tab
          href: isReviewerOrAdmin ? undefined : null,
          title: "Reviews",
          tabBarIcon: ({ color }) => (
            <IonIcons name="trail-sign-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IonIcons name="person-circle-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
