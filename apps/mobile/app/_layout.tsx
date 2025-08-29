import { useFonts } from "expo-font";
import * as WebBrowser from "expo-web-browser";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Image as ExpoImage } from "expo-image";
import { Image as RNImage } from "react-native";

import { config } from "@/config";
import { authClient } from "@/lib/auth-client";
import { RootProviders } from "@/components/providers/RootProviders";
import { RootLayoutNav } from "@/components/navigation/RootLayoutNav";
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
        // Dev auto-auth header handled centrally in apiFetch (ensureDevToken removed)
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
    <RootProviders>
      <RootLayoutNav
        initialRouteName={
          config.devAutoAuthAsTestUser || hasSeenOnboarding
            ? "(tabs)"
            : "signup"
        }
      />
    </RootProviders>
  );
}

// All navigation UI and providers are extracted to components/
