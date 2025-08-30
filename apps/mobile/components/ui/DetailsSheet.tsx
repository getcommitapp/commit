import React, { forwardRef, useMemo, ReactNode } from "react";
import { Text, View } from "react-native";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface DetailsSheetProps {
  title: string;
  description?: string | null;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
  onDismiss?: () => void;
  children?: ReactNode;
}

export const DetailsSheet = forwardRef<BottomSheetModal, DetailsSheetProps>(
  (
    {
      title,
      description,
      snapPoints,
      enableDynamicSizing = false,
      onDismiss,
      children,
    },
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const mutedForeground = useThemeColor({}, "mutedForeground");
    const border = useThemeColor({}, "border");

    const resolvedSnapPoints = useMemo(
      () => snapPoints ?? ["75%"],
      [snapPoints]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={resolvedSnapPoints}
        enableDynamicSizing={enableDynamicSizing}
        topInset={insets.top}
        onDismiss={onDismiss}
        backgroundStyle={{
          borderWidth: 1,
          borderColor: border,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.lg,
            gap: spacing.lg,
          }}
        >
          <SafeAreaView edges={["bottom"]}>
            <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
              <ThemedText style={{ ...textVariants.title3 }}>
                {title}
              </ThemedText>
              {description ? (
                <Text
                  style={{
                    ...textVariants.subheadline,
                    color: mutedForeground,
                  }}
                >
                  {description}
                </Text>
              ) : null}
            </View>

            {children}
          </SafeAreaView>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

DetailsSheet.displayName = "DetailsSheet";
