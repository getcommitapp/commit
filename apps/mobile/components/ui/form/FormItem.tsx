import React from "react";
import { Pressable, View, Text } from "react-native";
import { useRouter, type Href } from "expo-router";
import { textVariants, spacing, useThemeColor } from "@/components/Themed";
import ChevronRight from "@/assets/icons/chevron-right.svg";

interface FormItemProps {
  label: string;
  value?: string | React.ReactNode;
  onPress?: () => void;
  testID?: string;
  navigateTo?: Href;
}

export function FormItem({
  label,
  value,
  onPress,
  testID,
  navigateTo,
}: FormItemProps) {
  // Lightweight event emitter to coordinate blur across Form controls
  // Singleton stored on globalThis to avoid duplicate instances across fast refresh
  const formEmitter: {
    listeners?: Set<(sourceId?: string) => void>;
    emit?: (sourceId?: string) => void;
    subscribe?: (listener: (sourceId?: string) => void) => () => void;
  } = (globalThis as any).__COMMIT_FORM_EMITTER__ || {};
  if (!formEmitter.listeners) {
    formEmitter.listeners = new Set();
    formEmitter.emit = (sourceId?: string) => {
      formEmitter.listeners?.forEach((l) => l(sourceId));
    };
    formEmitter.subscribe = (listener: (sourceId?: string) => void) => {
      formEmitter.listeners?.add(listener);
      return () => formEmitter.listeners?.delete(listener);
    };
    (globalThis as any).__COMMIT_FORM_EMITTER__ = formEmitter;
  }

  const border = useThemeColor({}, "border");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const muted = useThemeColor({}, "muted");
  const text = useThemeColor({}, "text");
  const router = useRouter();

  const handlePress = () => {
    // Notify listeners so any open popovers can close
    formEmitter.emit?.(testID);
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
