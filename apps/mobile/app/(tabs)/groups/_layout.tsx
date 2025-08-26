import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";
import {
  ThemedText,
  useThemeColor,
  textVariants,
  spacing,
} from "@/components/Themed";

export default function GroupsStackLayout() {
  const primaryColor = useThemeColor({}, "primary");
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
          headerTransparent: false,
          presentation: "modal",
          headerLargeTitle: false,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              hitSlop={10}
              onPress={() => router.back()}
              style={{ paddingHorizontal: spacing.sm, paddingVertical: 6 }}
            >
              <ThemedText
                style={[textVariants.bodyEmphasized, { color: primaryColor }]}
              >
                Cancel
              </ThemedText>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
