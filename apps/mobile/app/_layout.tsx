import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { Image as ExpoImage } from "expo-image";
import { Image as RNImage, AppState } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { View } from "@/components/Themed";
import { config } from "@/config";
import { authClient } from "@/lib/auth-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Complete OAuth browser sessions when the app is opened via deep link
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [ready, setReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const check = async () => {
      try {
        if (config.devResetOnboardingOnReload) {
          await AsyncStorage.removeItem("hasSeenOnboarding");
          try {
            await authClient.signOut();
          } catch (_) {
            // Ignore sign out errors in dev reset flow
          }
        }
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        const hasSeenOnboarding = value === "true";
        setHasSeenOnboarding(hasSeenOnboarding);

        // Prefetch app assets (populate expo-image cache)
        try {
          const imageModules = [
            require("@/assets/images/icon.png"),
            require("@/assets/images/onboarding/onboarding-1.png"),
            require("@/assets/images/onboarding/onboarding-2.png"),
            require("@/assets/images/onboarding/onboarding-3.png"),
            require("@/assets/images/onboarding/onboarding-4.png"),
          ];
          const uris = imageModules
            .map((mod) => RNImage.resolveAssetSource(mod)?.uri)
            .filter(Boolean) as string[];
          await ExpoImage.prefetch(uris);
        } catch (_) {
          // Ignore asset prefetch errors; app can still proceed
        }
      } catch (_) {
        setHasSeenOnboarding(false);
      } finally {
        setReady(true);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (loaded && ready) {
      SplashScreen.hideAsync();
    }
  }, [loaded, ready]);

  if (!loaded || !ready) {
    return null;
  }

  return (
    <RootLayoutNav initialRouteName={hasSeenOnboarding ? "(tabs)" : "signup"} />
  );
}

interface RootLayoutNavProps {
  initialRouteName: string;
}

function RootLayoutNav({ initialRouteName }: RootLayoutNavProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const sub = AppState.addEventListener("change", () => {});
    return () => sub.remove();
  }, []);

  const isDark = colorScheme === "dark";
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const tokens = isDark ? Colors.dark : Colors.light;

  const navigationTheme = {
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

  useEffect(() => {
    if (config.devDefaultPage) {
      router.replace(config.devDefaultPage as unknown as any);
    } else {
      router.replace(("/" + initialRouteName) as unknown as any);
    }
  }, [initialRouteName, router]);

  return (
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
  );
}
