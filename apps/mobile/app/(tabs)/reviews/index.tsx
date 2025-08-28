import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  ThemedText,
  spacing,
  textVariants,
  useThemeColor,
} from "@/components/Themed";

export default function ReviewsScreen() {
  const failColor = useThemeColor({}, "danger");
  const successColor = useThemeColor({}, "success");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const card = useThemeColor({}, "card");
  const placeholderBorder = useThemeColor({}, "border");

  const goal = {
    title: "Morning Workout",
    imageDescription: "Photo of the user completing the morning workout",
  };

  const screenHeight = Dimensions.get("window").height;
  const imageHeight = screenHeight * 0.5;

  return (
    <ScreenLayout largeTitle>
      <ThemedText style={{ ...textVariants.title3 }}>{goal.title}</ThemedText>

      {/* Placeholder for image */}
      <View
        style={[
          styles.imagePlaceholder,
          {
            height: imageHeight,
            backgroundColor: card,
            borderColor: placeholderBorder,
          },
        ]}
      >
        <Text style={[styles.placeholderText, { color: mutedForeground }]}>
          Image Placeholder
        </Text>
      </View>

      <ThemedText style={[styles.description, { color: mutedForeground }]}>
        {goal.imageDescription}
      </ThemedText>

      <View style={styles.buttons}>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={60}
            color={failColor}
          />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={60}
            color={successColor}
          />
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  imagePlaceholder: {
    width: "100%",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderRadius: spacing.sm,
  },
  placeholderText: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    padding: spacing.sm,
  },
});
