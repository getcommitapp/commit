import { Stack, router } from "expo-router";
import { Platform } from "react-native";
import { useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";
import { HeaderButton } from "@/components/navigation/HeaderButton";
import { authClient } from "@/lib/auth-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileStackLayout() {
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
          title: "My Profile",
          headerRight: () => (
            <HeaderButton
              icon="log-out-outline"
              label="Sign out"
              onPress={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onError: async () => {
                      try {
                        await AsyncStorage.removeItem("hasSeenOnboarding");
                      } catch (_) {}
                      router.replace("/signup");
                    },
                    onSuccess: async () => {
                      try {
                        await AsyncStorage.removeItem("hasSeenOnboarding");
                      } catch (_) {}
                      router.replace("/signup");
                    },
                  },
                });
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="method"
        options={{
          title: "Payment Method",
          headerTitle: "Payment method",
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
