import { Platform, RefreshControl, ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/components/Themed";
import { useCallback, useState } from "react";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  largeTitle?: boolean;
  fullscreen?: boolean;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
  scrollable?: boolean;
  onRefresh?: (() => void) | (() => Promise<void>);
}

export function ScreenLayout({
  children,
  style,
  largeTitle = false,
  fullscreen = false,
  keyboardShouldPersistTaps = "handled",
  scrollable = true,
  onRefresh,
}: Props) {
  const paddingTop = Platform.select({
    ios: spacing.md,
    android: fullscreen ? 0 : 56,
    default: spacing.md,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={
        fullscreen
          ? Platform.select({
              ios: largeTitle ? ["top", "bottom"] : ["bottom"],
              android: [],
              default: ["top", "bottom"],
            })
          : Platform.select({
              ios: largeTitle ? ["top"] : [],
              android: ["top"],
              default: ["top"],
            })
      }
    >
      <ScrollView
        scrollEnabled={scrollable}
        contentContainerStyle={{
          paddingTop,
          paddingHorizontal: spacing.headerContentInset,
          paddingBottom: spacing.md,
          ...style,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              progressViewOffset={paddingTop}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
