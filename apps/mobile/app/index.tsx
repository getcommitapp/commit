import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { config } from "../config";
import { authClient } from "@/lib/auth-client";

export default function IndexGate() {
  const [ready, setReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

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
        setHasSeenOnboarding(value === "true");
      } catch (_) {
        setHasSeenOnboarding(false);
      } finally {
        setReady(true);
      }
    };
    check();
  }, []);

  if (!ready || hasSeenOnboarding === null) return null;

  // In development, allow overriding the start route for faster iteration
  if (config.devDefaultPage) {
    return (
      <Redirect href={{ pathname: config.devDefaultPage as unknown as any }} />
    );
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/signup" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
