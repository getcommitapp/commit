import { View, StyleSheet, Dimensions, Pressable } from "react-native";
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
  const textGray = useThemeColor({}, "textSecondary");
  const placeholderBg = useThemeColor({}, "cardBackground");
  const placeholderBorder = useThemeColor({}, "border");

  const goal = {
    title: "Morning Workout",
    imageDescription: "Photo of the user completing the morning workout",
  };

  const screenHeight = Dimensions.get("window").height;
  const imageHeight = screenHeight * 0.5;

  return (
    <ScreenLayout largeTitle style={{ backgroundColor: "#fff" }}>
      <ThemedText style={styles.title}>{goal.title}</ThemedText>

      {/* Placeholder for image */}
      <View
        style={[
          styles.imagePlaceholder,
          { height: imageHeight, backgroundColor: placeholderBg, borderColor: placeholderBorder },
        ]}
      >
        <ThemedText style={[styles.placeholderText, { color: textGray }]}>
          Image Placeholder
        </ThemedText>
      </View>

      <ThemedText style={[styles.description, { color: textGray }]}>
        {goal.imageDescription}
      </ThemedText>

      <View style={styles.buttons}>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <MaterialCommunityIcons name="close-circle-outline" size={60} color={failColor} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <MaterialCommunityIcons name="check-circle-outline" size={60} color={successColor} />
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.md,
    textAlign: "center",
  },
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
