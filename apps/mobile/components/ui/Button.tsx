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

type ButtonVariant = "primary" | "secondary" | "accent" | "border";

type Props = {
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
};

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
}: Props) {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const accent = useThemeColor({}, "accent");
  const border = useThemeColor({}, "border");
  const isSecondary = variant === "secondary";
  const isAccent = variant === "accent";

  let backgroundColor = primary;
  let textColor = secondary;
  let borderColor = border;
  let borderWidth = 0;
  if (isSecondary) {
    backgroundColor = secondary;
    textColor = primary;
  } else if (isAccent) {
    backgroundColor = accent;
    textColor = primary;
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
