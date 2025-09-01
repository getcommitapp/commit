import { Stack } from "expo-router";
import { useThemeColor } from "@/components/Themed";
import { Platform } from "react-native";

export default function ReviewsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ ios: false, android: true }),
        headerShadowVisible: false,
        headerStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Reviews" }} />
    </Stack>
  );
}
