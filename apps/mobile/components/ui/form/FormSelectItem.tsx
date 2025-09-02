import React from "react";
import { Text } from "react-native";
import { FormItem } from "./FormItem";
import { textVariants, useThemeColor } from "@/components/Themed";

export interface FormSelectItemProps {
  label: string;
  value?: string;
  navigateTo: React.ComponentProps<typeof FormItem>["navigateTo"];
  testID?: string;
}

export function FormSelectItem({
  label,
  value,
  navigateTo,
  testID,
}: FormSelectItemProps) {
  const mutedForeground = useThemeColor({}, "mutedForeground");
  return (
    <FormItem
      label={label}
      value={
        value ? (
          <Text style={{ ...textVariants.body, color: mutedForeground }}>
            {value}
          </Text>
        ) : undefined
      }
      navigateTo={navigateTo}
      testID={testID}
    />
  );
}
