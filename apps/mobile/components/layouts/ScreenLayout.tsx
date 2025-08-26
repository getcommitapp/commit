import { Platform, ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/components/Themed";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenLayout({ children, style }: Props) {
  const tabBarHeight = Platform.select({ ios: 49, android: 56, default: 56 });
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingVertical: spacing.md,
          paddingBottom: spacing.md + tabBarHeight,
          ...style,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
