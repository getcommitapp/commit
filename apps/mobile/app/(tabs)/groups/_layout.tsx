import { Stack, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useThemeColor, ThemedText } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";
import React from "react";

export default function GroupsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const router = useRouter();

  // Removed dropdown; showing direct actions instead

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
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                accessibilityRole="button"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: textColor + '15' }}
                onPress={() => router.push('/(tabs)/groups/create')}
              >
                <IonIcons name="create-outline" size={18} color={textColor} />
                <ThemedText style={{ fontSize: 14 }}>Create</ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: textColor + '15' }}
                onPress={() => router.push('/(tabs)/groups/join')}
              >
                <IonIcons name="enter-outline" size={18} color={textColor} />
                <ThemedText style={{ fontSize: 14 }}>Join</ThemedText>
              </Pressable>
            </View>
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
