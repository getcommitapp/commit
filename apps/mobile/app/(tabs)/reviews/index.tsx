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
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useReviewUpdate } from "@/lib/hooks/useReviewUpdate";
import { createApiImageSource } from "@/lib/api";

export default function ReviewsScreen() {
  const { data: reviews, isLoading, error, refetch } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<{
    uri: string;
    headers: any;
  } | null>(null);

  const failColor = useThemeColor({}, "danger");
  const successColor = useThemeColor({}, "success");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const card = useThemeColor({}, "card");
  const placeholderBorder = useThemeColor({}, "border");

  const screenHeight = Dimensions.get("window").height;
  const imageHeight = screenHeight * 0.5;

  const reviewUpdate = useReviewUpdate();

  // Reset index if reviews list changes significantly
  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex >= reviews.length) {
      setCurrentIndex(0);
    }
  }, [reviews, currentIndex]);

  // Build image source with auth headers when photoUrl changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      const url = reviews?.[currentIndex]?.photoUrl;
      if (!url) {
        if (mounted) setImageSource(null);
        return;
      }
      try {
        const src = await createApiImageSource(url);
        if (mounted) setImageSource(src as any);
      } catch {
        if (mounted) setImageSource(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [reviews, currentIndex]);

  // Reset image loading state when the current image changes
  useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
  }, [currentIndex, reviews]);

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

      {!!currentReview.goalDescription && (
        <ThemedText
          style={{
            ...textVariants.body,
            color: mutedForeground,
            marginBottom: spacing.sm,
          }}
        >
          {currentReview.goalDescription}
        </ThemedText>
      )}

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
        {currentReview.photoUrl && !imageError && imageSource ? (
          <>
            {isImageLoading && (
              <View
                style={[
                  styles.skeleton,
                  { backgroundColor: placeholderBorder },
                ]}
              />
            )}
            <Image
              source={imageSource}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}
              contentFit="cover"
              transition={400}
              cachePolicy="memory-disk"
              allowDownscaling
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
              onError={(e) => {
                console.error("Error loading image", e);
                setIsImageLoading(false);
                setImageError(true);
              }}
            />
          </>
        ) : (
          <Text style={[styles.placeholderText, { color: mutedForeground }]}>
            No Image Provided
          </Text>
        )}
      </View>

      <ThemedText style={[styles.description, { color: mutedForeground }]}>
        Photo submission
      </ThemedText>

      {/* Review counter */}
      <ThemedText style={[styles.counter, { color: mutedForeground }]}>
        Review {currentIndex + 1} of {reviews.length}
      </ThemedText>

      {/* Action buttons */}
      <View style={styles.buttons}>
        <Pressable
          style={styles.iconButton}
          onPress={handleReject}
          disabled={reviewUpdate.isPending}
        >
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={60}
            color={failColor}
          />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={handleApprove}
          disabled={reviewUpdate.isPending}
        >
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
    position: "relative",
  },
  skeleton: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
