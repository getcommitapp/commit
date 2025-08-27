import { Stack, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";

export default function GroupsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const router = useRouter();

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
              hitSlop={10}
              onPress={() => router.push("/(tabs)/groups/create")}
            >
              <IonIcons name="add" size={28} color={textColor} />
            </Pressable>
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
        }}
      />
    </Stack>
  );
}
