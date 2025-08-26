import React from "react";
import { View } from "react-native";
import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";

type CardProps = {
  left: React.ReactNode;
  right?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

export default function Card({
  left,
  right,
  accessibilityLabel,
  testID,
}: CardProps) {
  const text = useThemeColor({}, "text");

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={{
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.lg,
      }}
    >
      {typeof left === "string" ? (
        <ThemedText style={{ ...textVariants.body, color: text }}>
          {left}
        </ThemedText>
      ) : (
        left
      )}
      {right !== undefined && right !== null ? (
        typeof right === "string" ? (
          <ThemedText style={{ ...textVariants.body, color: text }}>
            {right}
          </ThemedText>
        ) : (
          right
        )
      ) : null}
    </View>
  );
}
