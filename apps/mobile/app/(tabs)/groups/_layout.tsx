import { Stack, useRouter } from "expo-router";
import { Platform, View } from "react-native";
import { HeaderButton } from "@/components/navigation/HeaderButton";
import { spacing, useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";

export default function GroupsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();
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
          title: "My Groups",
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <HeaderButton
                icon="add"
                label="Create"
                onPress={() => {
                  dismissAll();
                  router.push("/(tabs)/groups/create");
                }}
              />
              <HeaderButton
                icon="enter-outline"
                label="Join"
                onPress={() => {
                  dismissAll();
                  router.push("/(tabs)/groups/join");
                }}
              />
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
          headerLeft: () => <CancelButton />,
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
          headerLeft: () => <CancelButton />,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
