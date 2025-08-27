import { Platform, ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/components/Themed";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  largeTitle?: boolean;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
}

export function ScreenLayout({
  children,
  style,
  largeTitle = false,
  keyboardShouldPersistTaps = "handled",
}: Props) {
  const tabBarHeight = Platform.select({ ios: 49, android: 0, default: 56 });
  const paddingTop = largeTitle
    ? Platform.select({
        ios: spacing.md,
        android: 56,
        default: spacing.md,
      })
    : spacing.md;
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop,
          paddingBottom: spacing.md + tabBarHeight,
          ...style,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
