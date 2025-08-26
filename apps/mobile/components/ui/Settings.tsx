import React from "react";
import { Pressable, View, Text } from "react-native";
import { useRouter, type Href } from "expo-router";
import {
  ThemedText,
  spacing,
  radii,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import ChevronRight from "@/assets/icons/chevron-right.svg";

type SettingsGroupProps = {
  title?: string;
  children: React.ReactNode;
  footer?: string;
  style?: any;
  backgroundStyle?: any;
};

export function SettingsGroup({
  title,
  children,
  footer,
  style,
  backgroundStyle,
}: SettingsGroupProps) {
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

type SettingsRowProps = {
  label: string;
  value?: string | React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  testID?: string;
  navigateTo?: Href;
};

export function SettingsRow({
  label,
  value,
  onPress,
  last,
  testID,
  navigateTo,
}: SettingsRowProps) {
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

type SettingsSpacerProps = { size?: keyof typeof spacing };
export function SettingsSpacer({ size = "xl" }: SettingsSpacerProps) {
  return <View style={{ height: spacing[size] }} />;
}
