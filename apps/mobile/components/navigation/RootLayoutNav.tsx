import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { ThemedView } from "@/components/Themed";
import { config } from "@/config";
import { useGoals } from "@/lib/hooks/useGoals";

export interface RootLayoutNavProps {
  initialRouteName: string;
}

export function RootLayoutNav({ initialRouteName }: RootLayoutNavProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const presentedGoalIdsRef = useRef<Set<string>>(new Set());
  const { data: goals } = useGoals();

  const isDark = colorScheme === "dark";
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const tokens = isDark ? Colors.dark : Colors.light;

  const navigationTheme = useMemo(() => {
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: tokens.background,
        card: tokens.card,
        border: tokens.border,
        text: tokens.text,
        primary: tokens.primary,
      },
    } as const;
  }, [
    baseTheme,
    tokens.background,
    tokens.card,
    tokens.border,
    tokens.text,
    tokens.primary,
  ]);

  useEffect(() => {
    if (config.devDefaultPage) {
      router.replace(config.devDefaultPage as unknown as any);
    } else {
      const route =
        initialRouteName === "(tabs)" ? "/(tabs)/home" : "/" + initialRouteName;
      router.replace(route as unknown as any);
    }
  }, [initialRouteName, router]);

  // Present check-in modal globally when any goal requires it.
  useEffect(() => {
    if (!goals || goals.length === 0) return;
    // Do not stack multiple check-in modals; present the first pending one not yet shown.
    const pending = goals.find(
      (g) =>
        (g.actions || []).some(
          (a) => a.kind === "checkin" && a.presentation === "modal" && a.enabled
        ) && !presentedGoalIdsRef.current.has(g.id)
    );
    if (!pending) return;

    // Avoid pushing again if we're already on the checkin route for this id
    const alreadyOnCheckin = pathname?.startsWith(`/checkin/`);
    if (!alreadyOnCheckin) {
      presentedGoalIdsRef.current.add(pending.id);
      router.push({
        pathname: "/checkin/[id]",
        params: { id: pending.id },
      } as any);
    }
  }, [goals, pathname, router]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <ThemedView
          lightColor={Colors.light.background}
          darkColor={Colors.dark.background}
          style={{ flex: 1 }}
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack initialRouteName={initialRouteName}>
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="checkin/[id]"
              options={{
                presentation: "modal",
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </Stack>
        </ThemedView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
