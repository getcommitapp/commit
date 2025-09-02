import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { StatusLayout } from "@/components/layouts/StatusLayout";

import {
  spacing,
  useThemeColor,
  ThemedText,
  textVariants,
} from "@/components/Themed";
import { useReviews } from "@/lib/hooks/useReviews";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import { useReviewUpdate } from "@/lib/hooks/useReviewUpdate";
import { createApiImageSource } from "@/lib/api";

export default function ReviewsScreen() {
  const { data: reviews, isLoading, isError, refetch } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<{
    uri: string;
    headers: any;
  } | null>(null);
  const [nextImageSource, setNextImageSource] = useState<{
    uri: string;
    headers: any;
  } | null>(null);

  const mutedForeground = useThemeColor({}, "mutedForeground");
  const background = useThemeColor({}, "background");
  const placeholderBorder = useThemeColor({}, "border");
  const borderColor = useThemeColor({}, "border");

  const screenWidth = Dimensions.get("window").width;

  const reviewUpdate = useReviewUpdate();

  // Swipe gesture state
  const position = useRef(new Animated.ValueXY()).current;
  const swipeThreshold = useMemo(() => screenWidth * 0.25, [screenWidth]);

  const rotate = position.x.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: [0, 0.35],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-swipeThreshold, 0],
    outputRange: [0.35, 0],
    extrapolate: "clamp",
  });

  const handleApprove = useCallback(() => {
    if (!reviews) return;
    const currentReview = reviews[currentIndex];

    // Do not increment index on success; optimistic cache removal will shift the next item in place
    reviewUpdate.mutate({
      goalId: currentReview.goalId,
      userId: currentReview.userId,
      occurrenceDate: currentReview.occurrenceDate,
      approvalStatus: "approved",
    });
  }, [reviews, currentIndex, reviewUpdate]);

  const handleReject = useCallback(() => {
    if (!reviews) return;
    const currentReview = reviews[currentIndex];

    reviewUpdate.mutate({
      goalId: currentReview.goalId,
      userId: currentReview.userId,
      occurrenceDate: currentReview.occurrenceDate,
      approvalStatus: "rejected",
    });
  }, [reviews, currentIndex, reviewUpdate]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5,
        onPanResponderMove: Animated.event(
          [
            null,
            {
              dx: position.x,
              dy: position.y,
            },
          ],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > swipeThreshold) {
            Animated.timing(position, {
              toValue: { x: screenWidth + 100, y: gesture.dy },
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              handleApprove();
            });
          } else if (gesture.dx < -swipeThreshold) {
            Animated.timing(position, {
              toValue: { x: -screenWidth - 100, y: gesture.dy },
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              handleReject();
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [swipeThreshold, screenWidth, position, handleApprove, handleReject]
  );

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

  // Preload next image source
  useEffect(() => {
    let mounted = true;
    (async () => {
      const nextUrl = reviews?.[currentIndex + 1]?.photoUrl;
      if (!nextUrl) {
        if (mounted) setNextImageSource(null);
        return;
      }
      try {
        const src = await createApiImageSource(nextUrl);
        if (mounted) setNextImageSource(src as any);
      } catch {
        if (mounted) setNextImageSource(null);
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

  if (isLoading) {
    return <StatusLayout status="loading" title="Loading your reviews..." />;
  }

  if (isError) {
    return (
      <StatusLayout
        status="error"
        title="Couldn't load reviews"
        onRefresh={refetch}
      />
    );
  }

  if (!reviews || reviews.length === 0 || currentIndex >= reviews.length) {
    return (
      <StatusLayout
        status="empty"
        title="All caught up"
        message="No reviews pending at the moment."
        onRefresh={refetch}
      />
    );
  }

  // Get current review item
  const currentReview = reviews[currentIndex];

  return (
    <ScreenLayout
      scrollable={false}
      style={{
        flex: 1,
      }}
      onRefresh={async () => {
        await refetch();
      }}
    >
      {/* Goal information header */}
      <View
        style={{
          marginBottom: spacing.md,
          borderTopWidth: 2,
          borderColor: borderColor,
          paddingTop: spacing.md,
        }}
      >
        <ThemedText style={[styles.goalTitle, { marginBottom: spacing.xs }]}>
          {currentReview.goalName}
        </ThemedText>
        {currentReview.goalDescription && (
          <Text style={[styles.goalDescription, { color: mutedForeground }]}>
            {currentReview.goalDescription}
          </Text>
        )}
      </View>

      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        {/* Next card underneath */}
        <View style={styles.cardContainer} pointerEvents="none">
          {nextImageSource ? (
            <Image
              source={nextImageSource}
              style={styles.fullImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              allowDownscaling
            />
          ) : (
            <View style={[styles.fullImage, { backgroundColor: background }]} />
          )}
        </View>

        {/* Current card */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {currentReview.photoUrl && !imageError && imageSource ? (
            <>
              {isImageLoading && (
                <View
                  style={[
                    styles.fullImage,
                    { backgroundColor: placeholderBorder },
                  ]}
                />
              )}
              <Image
                source={imageSource}
                style={styles.fullImage}
                contentFit="cover"
                transition={200}
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
              {/* Overlays */}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.overlay,
                  { backgroundColor: "#16a34a", opacity: likeOpacity },
                ]}
              />
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.overlay,
                  { backgroundColor: "#dc2626", opacity: nopeOpacity },
                ]}
              />
            </>
          ) : (
            <View
              style={[
                styles.fullImage,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: background,
                },
              ]}
            >
              <Text
                style={[styles.placeholderText, { color: mutedForeground }]}
              >
                No Image Provided
              </Text>
            </View>
          )}
        </Animated.View>
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
  cardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    overflow: "hidden",
  },
  fullImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  goalTitle: {
    ...textVariants.title3,
  },
  goalDescription: {
    ...textVariants.body,
  },
});
