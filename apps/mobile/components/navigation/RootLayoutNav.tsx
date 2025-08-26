import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { View } from "@/components/Themed";
import { config } from "@/config";

export interface RootLayoutNavProps {
  initialRouteName: string;
}

export function RootLayoutNav({ initialRouteName }: RootLayoutNavProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();

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

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <View
          lightColor={Colors.light.background}
          darkColor={Colors.dark.background}
          style={{ flex: 1 }}
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack initialRouteName={initialRouteName}>
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
