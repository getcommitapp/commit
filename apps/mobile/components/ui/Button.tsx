import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  Text,
  useThemeColor,
  spacing,
  radii,
  textVariants,
} from "@/components/Themed";

type ButtonVariant = "primary" | "secondary" | "accent";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  leftIcon?: ReactNode;
  variant?: ButtonVariant;
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
  style,
  textStyle,
  loading = false,
  rightIcon,
}: Props) {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const accent = useThemeColor({}, "accent");

  const isSecondary = variant === "secondary";
  const isAccent = variant === "accent";

  let backgroundColor = primary;
  let textColor = secondary;
  if (isSecondary) {
    backgroundColor = secondary;
    textColor = primary;
  } else if (isAccent) {
    backgroundColor = accent;
    textColor = primary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[
        {
          backgroundColor,
          borderRadius: radii.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          opacity: disabled || loading ? 0.5 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.md,
        },
        style,
      ]}
    >
      {leftIcon}
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[
            textVariants.subheadlineEmphasized,
            { color: textColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {rightIcon}
    </TouchableOpacity>
  );
}
