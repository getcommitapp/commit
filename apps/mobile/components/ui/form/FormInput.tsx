import React from "react";
import { View, TextInput } from "react-native";
import { textVariants, spacing, useThemeColor } from "@/components/Themed";

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
  returnKeyType?: React.ComponentProps<typeof TextInput>["returnKeyType"];
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  autoCapitalize = "none",
  secureTextEntry,
  keyboardType,
  returnKeyType,
  autoCorrect,
  multiline,
  numberOfLines,
}: FormInputProps) {
  const text = useThemeColor({}, "text");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const card = useThemeColor({}, "card");

  return (
    <>
      <View
        style={{
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          backgroundColor: card,
        }}
      >
        <TextInput
          placeholder={placeholder ?? label}
          placeholderTextColor={mutedForeground}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={{
            ...textVariants.body,
            color: text,
            padding: 0,
            // Ensure multiline inputs start at the top-left
            textAlignVertical: multiline ? "top" : undefined,
            minHeight:
              multiline && numberOfLines ? numberOfLines * 20 : undefined,
          }}
        />
      </View>
    </>
  );
}
