import { Stack, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useThemeColor, ThemedText } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";
import React, { useState } from "react";

export default function GroupsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const router = useRouter();

  const [showActions, setShowActions] = useState(false);

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
            <>
              <Pressable
                hitSlop={10}
                onPress={() => setShowActions((s) => !s)}
              >
                <IonIcons name="add" size={28} color={textColor} />
              </Pressable>
              {showActions && (
                <View
                  style={{
                    position: "absolute",
                    top: Platform.select({ ios: 0, android: 0 }),
                    right: 0,
                    marginTop: 40,
                    backgroundColor,
                    padding: 16,
                    borderRadius: 12,
                    gap: 8,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    zIndex: 1000,
                    minWidth: 150,
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setShowActions(false);
                      router.push("/(tabs)/groups/create");
                    }}
                    style={{ 
                      flexDirection: "row", 
                      alignItems: "center", 
                      gap: 8, 
                      padding: 12,
                      borderRadius: 8,
                      minHeight: 44,
                    }}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <IonIcons name="create-outline" size={20} color={textColor} />
                    <ThemedText style={{ fontSize: 16 }}>Create Group</ThemedText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setShowActions(false);
                      router.push("/(tabs)/groups/join");
                    }}
                    style={{ 
                      flexDirection: "row", 
                      alignItems: "center", 
                      gap: 8, 
                      padding: 12,
                      borderRadius: 8,
                      minHeight: 44,
                    }}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <IonIcons name="enter-outline" size={20} color={textColor} />
                    <ThemedText style={{ fontSize: 16 }}>Join Group</ThemedText>
                  </Pressable>
                </View>
              )}
            </>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "New Group",
          headerTitle: "New group",
          headerTitleAlign: Platform.select({ android: "center" }),
          headerTransparent: false,
          presentation: "modal",
          headerLargeTitle: false,
          headerBackVisible: false,
          headerLeft: () => <CancelButton onPress={() => router.back()} />,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="join"
        options={{
          title: "Join Group",
          headerTitle: "Join group",
          headerTitleAlign: Platform.select({ android: "center" }),
          headerTransparent: false,
          presentation: "modal",
          headerLargeTitle: false,
          headerBackVisible: false,
          headerLeft: () => <CancelButton onPress={() => router.back()} />,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
