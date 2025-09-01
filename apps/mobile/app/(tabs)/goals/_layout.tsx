import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import { ThemedText, useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

export default function GoalsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const router = useRouter();
  const params = useLocalSearchParams();
  const { dismissAll } = useBottomSheetModal();

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
              accessibilityRole="button"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: textColor + "15",
              }}
              onPress={() => {
                dismissAll();
                router.push("/(tabs)/goals/create");
              }}
            >
              <IonIcons name="create-outline" size={18} color={textColor} />
              <ThemedText style={{ fontSize: 14 }}>Create</ThemedText>
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
