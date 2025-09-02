import React from "react";
import { Pressable, View, Text, Switch } from "react-native";
import { spacing, textVariants, useThemeColor } from "@/components/Themed";

interface FormInputToggleProps {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  testID?: string;
}

export function FormInputToggle({
  label,
  value,
  onValueChange,
  testID,
}: FormInputToggleProps) {
  const border = useThemeColor({}, "border");
  const text = useThemeColor({}, "text");

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="button"
      testID={testID}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? border : "transparent",
        },
      ]}
    >
      <View
        style={{
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.lg,
        }}
      >
        <Text style={{ ...textVariants.body, color: text }}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    </Pressable>
  );
}
