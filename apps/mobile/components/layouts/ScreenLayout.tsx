import { Platform, RefreshControl, ScrollView, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/components/Themed";
import { useCallback, useState } from "react";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  largeTitle?: boolean;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
  scrollable?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export function ScreenLayout({
  children,
  style,
  largeTitle = false,
  keyboardShouldPersistTaps = "handled",
  scrollable = true,
  onRefresh,
}: Props) {
  const tabBarHeight = Platform.select({ ios: 49, android: 0, default: 56 });
  const paddingTop = largeTitle
    ? Platform.select({
        ios: spacing.md,
        android: 56,
        default: spacing.md,
      })
    : spacing.md;
  const edges = (
    largeTitle
      ? Platform.select({ ios: ["top", "bottom"], android: ["top"] })
      : Platform.select({ ios: ["bottom"], android: [] })
  ) as Edge[];

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
      edges={edges}
    >
      <ScrollView
        scrollEnabled={scrollable}
        contentContainerStyle={{
          paddingTop,
          paddingHorizontal: spacing.headerContentInset,
          paddingBottom: tabBarHeight + (scrollable ? 0 : spacing.md),
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
