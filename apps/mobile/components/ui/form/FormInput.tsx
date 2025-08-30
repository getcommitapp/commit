import React from "react";
import { View, TextInput } from "react-native";
import { textVariants, spacing, useThemeColor } from "@/components/Themed";

interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChangeText?: (text: string) => void;
  onChangeNumber?: (value: number | null) => void;
  type?: "text" | "number";
  onBlur?: () => void;
  onFocus?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
  returnKeyType?: React.ComponentProps<typeof TextInput>["returnKeyType"];
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  onChangeNumber,
  type = "text",
  onBlur,
  onFocus,
  autoCapitalize = "none",
  secureTextEntry,
  keyboardType,
  returnKeyType,
  autoCorrect,
  multiline,
  numberOfLines,
  maxLength,
}: FormInputProps) {
  const text = useThemeColor({}, "text");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const card = useThemeColor({}, "card");

  const displayValue =
    typeof value === "number" ? String(value) : (value ?? "");

  const handleChangeText = (incoming: string) => {
    if (type === "number") {
      // Allow digits and at most one decimal separator (dot or comma)
      const sanitized = incoming.replace(/[^0-9.,]/g, "");
      // Normalize first comma to dot, drop additional separators beyond first
      const parts = sanitized.replace(/,/g, ".").split(".");
      const normalized =
        parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : parts[0];
      if (onChangeText) onChangeText(normalized);
      if (onChangeNumber) {
        const parsed = normalized.length ? Number(normalized) : NaN;
        onChangeNumber(Number.isFinite(parsed) ? parsed : null);
      }
      return;
    }
    // Default text behavior
    if (onChangeText) onChangeText(incoming);
  };

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
          value={displayValue}
          onChangeText={handleChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          keyboardType={
            keyboardType ?? (type === "number" ? "decimal-pad" : undefined)
          }
          returnKeyType={returnKeyType}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
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
