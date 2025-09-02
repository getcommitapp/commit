import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Platform } from "react-native";

import { useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { HeaderButton } from "@/components/navigation/HeaderButton";
export default function GoalsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
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
            <HeaderButton
              icon="add"
              label="Create"
              onPress={() => {
                dismissAll();
                router.push("/(tabs)/goals/create");
              }}
            />
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
