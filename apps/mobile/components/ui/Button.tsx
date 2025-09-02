import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  ThemedText,
  useThemeColor,
  spacing,
  radii,
  textVariants,
} from "@/components/Themed";

type ButtonVariant = "primary" | "secondary" | "accent" | "border" | "danger";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  leftIcon?: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  loading?: boolean;
  rightIcon?: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  disabled,
  leftIcon,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  loading = false,
  rightIcon,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const accent = useThemeColor({}, "accent");
  const danger = useThemeColor({}, "danger");
  const border = useThemeColor({}, "border");
  const isSecondary = variant === "secondary";
  const isAccent = variant === "accent";

  let backgroundColor = accent;
  let textColor = primary;
  let borderColor = border;
  let borderWidth = 0;
  if (isSecondary) {
    backgroundColor = secondary;
    textColor = primary;
  } else if (isAccent) {
    backgroundColor = accent;
    textColor = primary;
  } else if (variant === "danger") {
    backgroundColor = danger;
    textColor = secondary;
  } else if (variant === "border") {
    backgroundColor = secondary;
    textColor = primary;
    borderColor = border;
    borderWidth = 1;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[
        {
          backgroundColor,
          borderRadius: radii.md,
          paddingVertical:
            size === "sm"
              ? spacing.sm
              : size === "lg"
                ? spacing.lg
                : spacing.md,
          paddingHorizontal:
            size === "sm"
              ? spacing.sm
              : size === "lg"
                ? spacing.lg
                : spacing.md,
          opacity: disabled || loading ? 0.5 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.md,
          borderWidth,
          borderColor,
        },
        style,
      ]}
    >
      {leftIcon}
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText
          style={[
            textVariants.subheadlineEmphasized,
            { color: textColor },
            textStyle,
          ]}
        >
          {title}
        </ThemedText>
      )}
      {rightIcon}
    </Pressable>
  );
}
