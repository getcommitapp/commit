import React, { ReactNode } from "react";
import { Pressable, TextStyle, ViewStyle } from "react-native";
import {
  Text,
  useThemeColor,
  spacing,
  radii,
  textVariants,
} from "@/components/Themed";

type ButtonVariant = "primary" | "secondary";

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  leftIcon?: ReactNode;
  variant?: ButtonVariant;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

export default function Button({
  title,
  onPress,
  disabled,
  leftIcon,
  variant = "primary",
  style,
  textStyle,
}: Props) {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");

  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: isSecondary ? secondary : primary,
          borderRadius: radii.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          opacity: pressed ? 0.9 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.md,
        },
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          textVariants.subheadlineEmphasized,
          { color: isSecondary ? primary : secondary },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
