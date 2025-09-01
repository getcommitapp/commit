import { Stack } from "expo-router";
import { useThemeColor } from "@/components/Themed";

export default function ReviewsStackLayout() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Reviews" }} />
    </Stack>
  );
}
