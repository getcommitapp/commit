import React from "react";
import { View } from "react-native";
import { spacing } from "@/components/Themed";

interface FormSpacerProps {
  size?: keyof typeof spacing;
}

export function FormSpacer({ size = "xl" }: FormSpacerProps) {
  return <View style={{ height: spacing[size] }} />;
}
