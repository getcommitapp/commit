import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";
import { useThemeColor } from "@/components/Themed";
import { CancelButton } from "@/components/navigation/CancelButton";

export default function ProfileStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
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
      <Stack.Screen name="index" options={{ title: "My Profile" }} />
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
          headerLeft: () => <CancelButton onPress={() => router.back()} />,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
