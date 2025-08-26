import React, { forwardRef, useMemo, ReactNode } from "react";
import { Text, View, Pressable } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  ThemedText,
  textVariants,
  spacing,
  useThemeColor,
} from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";

interface DetailsSheetProps {
  title: string;
  description: string;
  snapPoints?: string[];
  enableDynamicSizing?: boolean;
  onDismiss?: () => void;
  children?: ReactNode;
  actionButton?: {
    label: string;
    onPress: () => void;
    variant?: "primary" | "danger" | "secondary";
  };
}

export const DetailsSheet = forwardRef<BottomSheetModal, DetailsSheetProps>(
  (
    {
      title,
      description,
      snapPoints,
      enableDynamicSizing = true,
      onDismiss,
      children,
      actionButton,
    },
    ref
  ) => {
    const mutedForeground = useThemeColor({}, "mutedForeground");
    const primary = useThemeColor({}, "primary");
    const danger = useThemeColor({}, "danger");
    const border = useThemeColor({}, "border");
    const { dismiss } = useBottomSheetModal();

    const resolvedSnapPoints = useMemo(
      () => snapPoints ?? ["75%"],
      [snapPoints]
    );

    const getActionButtonStyle = () => {
      switch (actionButton?.variant) {
        case "danger":
          return { backgroundColor: danger };
        case "secondary":
          return { backgroundColor: mutedForeground };
        case "primary":
        default:
          return { backgroundColor: primary };
      }
    };

    const handleActionPress = () => {
      if (actionButton?.onPress) {
        actionButton.onPress();
      }
      dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={resolvedSnapPoints}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={onDismiss}
        backgroundStyle={{
          borderWidth: 1,
          borderColor: border,
        }}
      >
        <BottomSheetView
          style={{
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
              <Text
                style={{ ...textVariants.subheadline, color: mutedForeground }}
              >
                {description}
              </Text>
            </View>

            {children}

            {actionButton && (
              <Pressable
                onPress={handleActionPress}
                accessibilityRole="button"
                style={{
                  ...getActionButtonStyle(),
                  paddingVertical: spacing.md,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    ...textVariants.bodyEmphasized,
                    color: "white",
                  }}
                >
                  {actionButton.label}
                </Text>
              </Pressable>
            )}
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

DetailsSheet.displayName = "DetailsSheet";
