import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";
import { useReviews } from "@/lib/hooks/useReviews";
import { useState } from "react";
import { Image } from "expo-image";
import { useReviewUpdate } from "@/lib/hooks/useReviewUpdate";

export default function ReviewsScreen() {
  const { data: reviews, isLoading, error, refetch } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);

  const failColor = useThemeColor({}, "danger");
  const successColor = useThemeColor({}, "success");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const card = useThemeColor({}, "card");
  const placeholderBorder = useThemeColor({}, "border");

  const screenHeight = Dimensions.get("window").height;
  const imageHeight = screenHeight * 0.5;

  const reviewUpdate = useReviewUpdate();

  const handleApprove = async () => {
    if (!reviews) return;
    const currentReview = reviews[currentIndex];

    reviewUpdate.mutate(
      { goalId: currentReview.goalId, approvalStatus: "approved" },
      {
        onSuccess: () => {
          setCurrentIndex((i) => i + 1);
        },
      }
    );
  };

  const handleReject = async () => {
    if (!reviews) return;
    const currentReview = reviews[currentIndex];

    reviewUpdate.mutate(
      { goalId: currentReview.goalId, approvalStatus: "rejected" },
      {
        onSuccess: () => {
          setCurrentIndex((i) => i + 1);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <ScreenLayout largeTitle>
        <View style={{ padding: 24, alignItems: "center" }}>
          <ActivityIndicator />
          <ThemedText style={{ marginTop: 12 }}>
            Loading your reviews...
          </ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout largeTitle>
        <View style={{ padding: 24, alignItems: "center" }}>
          <ThemedText style={textVariants.bodyEmphasized}>
            Couldn&apos;t load reviews
          </ThemedText>
          <ThemedText
            onPress={() => refetch()}
            style={{ marginTop: 12, textDecorationLine: "underline" }}
          >
            Tap to retry
          </ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  if (!reviews || reviews.length === 0 || currentIndex >= reviews.length) {
    return (
      <ScreenLayout largeTitle>
        <View style={{ padding: 24, gap: 8, alignItems: "center" }}>
          <ThemedText style={textVariants.bodyEmphasized}>
            All caught up
          </ThemedText>
          <ThemedText>No reviews pending at the moment.</ThemedText>
        </View>
      </ScreenLayout>
    );
  }

  // Get current review item
  const currentReview = reviews[currentIndex];

  return (
    <ScreenLayout largeTitle>
      <ThemedText style={{ ...textVariants.title3 }}>
        {currentReview.goalName}
      </ThemedText>

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
        {currentReview.photoUrl ? (
          <Image
            source={currentReview.photoUrl}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
            contentFit="cover" // similar to resizeMode="cover"
            transition={1000} // optional: smooth fade-in
          />
        ) : (
          <Text style={[styles.placeholderText, { color: mutedForeground }]}>
            No Image Provided
          </Text>
        )}
      </View>

      <ThemedText style={[styles.description, { color: mutedForeground }]}>
        {currentReview.photoDescription || "No description provided"}
      </ThemedText>

      {/* Review counter */}
      <ThemedText style={[styles.counter, { color: mutedForeground }]}>
        Review {currentIndex + 1} of {reviews.length}
      </ThemedText>

      {/* Action buttons - keeping your exact layout */}
      <View style={styles.buttons}>
        <Pressable style={styles.iconButton} onPress={handleReject}>
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={60}
            color={failColor}
          />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={handleApprove}>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  counter: {
    fontSize: 14,
    marginBottom: spacing.md,
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
