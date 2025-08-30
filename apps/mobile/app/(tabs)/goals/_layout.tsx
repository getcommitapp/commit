import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";

export default function GoalsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const router = useRouter();
  const params = useLocalSearchParams();

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
          title: "My Goals",
          headerRight: () => (
            <Pressable
              hitSlop={10}
              onPress={() => router.push("/(tabs)/goals/create" as any)}
            >
              <IonIcons name="add" size={28} color={textColor} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "New Goal",
          headerTitle: "New Goal",
          headerTitleAlign: Platform.select({ android: "center" }),
          headerTransparent: false,
          presentation: "modal",
          headerLargeTitle: false,
          headerBackVisible: false,
          headerLeft: () => (
            <CancelButton
              onPress={() => {
                const forGroup =
                  params.forGroup === "1" || params.forGroup === "true";
                if (forGroup) {
                  router.dismissAll();
                  router.replace("/(tabs)/groups/create");
                } else {
                  router.back();
                }
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="create/custom"
        options={{
          title: "Custom Goal",
          headerTitle: "Custom Goal",
          headerTitleAlign: Platform.select({ android: "center" }),
          headerTransparent: false,
          presentation: "modal",
          headerLargeTitle: false,
          headerBackVisible: false,
          headerLeft: () => <CancelButton />,
        }}
      />
      <Stack.Screen
        name="create/new"
        options={{
          title: "New Goal",
          headerTitle: "New Goal",
          headerTitleAlign: Platform.select({ android: "center" }),
          headerTransparent: false,
          presentation: "modal",
          headerLargeTitle: false,
          headerBackVisible: false,
          headerLeft: () => <CancelButton />,
        }}
      />
    </Stack>
  );
}
