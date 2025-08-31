import React from "react";
import { View } from "react-native";
import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";

interface CardProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

export function Card({
  left,
  right,
  bottom,
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
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.lg,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          {typeof left === "string" ? (
            <ThemedText style={{ ...textVariants.body, color: text }}>
              {left}
            </ThemedText>
          ) : (
            left
          )}
        </View>
        {right !== undefined && right !== null ? (
          <View style={{ flexShrink: 0 }}>
            {typeof right === "string" ? (
              <ThemedText style={{ ...textVariants.body, color: text }}>
                {right}
              </ThemedText>
            ) : (
              right
            )}
          </View>
        ) : null}
      </View>
      {bottom ? <View>{bottom}</View> : null}
    </View>
  );
}
