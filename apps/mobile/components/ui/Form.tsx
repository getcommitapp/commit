import React from "react";
import { Pressable, View, Text, TextInput } from "react-native";
import { useRouter, type Href } from "expo-router";
import {
  ThemedText,
  spacing,
  radii,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import ChevronRight from "@/assets/icons/chevron-right.svg";

type FormProps = {
  title?: string;
  children: React.ReactNode;
  footer?: string;
  style?: any;
  backgroundStyle?: any;
};

export function Form({
  title,
  children,
  footer,
  style,
  backgroundStyle,
}: FormProps) {
  const card = useThemeColor({}, "card");
  const muted = useThemeColor({}, "mutedForeground");

  return (
    <View style={style}>
      {title ? (
        <Text
          style={{
            ...textVariants.footnote,
            textTransform: "uppercase",
            color: muted,
            marginBottom: spacing.sm,
            marginLeft: spacing.xs,
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: card,
          borderRadius: radii.md,
          overflow: "hidden",
          ...backgroundStyle,
        }}
      >
        {children}
      </View>
      {footer ? (
        <ThemedText
          style={{
            color: muted,
            marginTop: spacing.xs,
            marginLeft: spacing.xs,
          }}
        >
          {footer}
        </ThemedText>
      ) : null}
      <View style={{ height: spacing.xl }} />
    </View>
  );
}

type FormItemProps = {
  label: string;
  value?: string | React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  testID?: string;
  navigateTo?: Href;
};

export function FormItem({
  label,
  value,
  onPress,
  last,
  testID,
  navigateTo,
}: FormItemProps) {
  const border = useThemeColor({}, "border");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const muted = useThemeColor({}, "muted");
  const text = useThemeColor({}, "text");
  const router = useRouter();

  const handlePress = () => {
    if (navigateTo) {
      router.push(navigateTo);
      return;
    }
    if (onPress) {
      onPress();
    }
  };

  const RowContent = (
    <>
      <View
        style={{
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.lg,
        }}
      >
        <Text style={{ ...textVariants.body, color: text }}>{label}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          {value !== undefined && value !== null ? (
            typeof value === "string" ? (
              <Text style={{ ...textVariants.body, color: mutedForeground }}>
                {value}
              </Text>
            ) : (
              value
            )
          ) : null}
          {navigateTo ? (
            <ChevronRight
              width={16}
              height={16}
              color={muted}
              style={{
                marginEnd: -spacing.xs,
              }}
            />
          ) : null}
        </View>
      </View>
      {!last ? (
        <View
          style={{
            height: 0.5,
            backgroundColor: border,
            marginLeft: spacing.xl,
          }}
        />
      ) : null}
    </>
  );

  if (onPress || navigateTo) {
    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        testID={testID}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? border : "transparent",
          },
        ]}
      >
        {RowContent}
      </Pressable>
    );
  }
  return RowContent;
}

type FormSpacerProps = { size?: keyof typeof spacing };
export function FormSpacer({ size = "xl" }: FormSpacerProps) {
  return <View style={{ height: spacing[size] }} />;
}

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
  last?: boolean;
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
  last,
}: FormInputProps) {
  const border = useThemeColor({}, "border");
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
      {!last ? (
        <View
          style={{
            height: 0.5,
            backgroundColor: border,
            marginLeft: spacing.xl,
          }}
        />
      ) : null}
    </>
  );
}
