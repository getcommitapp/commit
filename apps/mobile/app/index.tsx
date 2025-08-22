import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { config } from "../config";

export default function IndexGate() {
  const [ready, setReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const check = async () => {
      try {
        if (config.resetOnboardingOnReload) {
          await AsyncStorage.removeItem("hasSeenOnboarding");
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

  if (!hasSeenOnboarding) {
    return <Redirect href="/signup" />;
  }

  return <Redirect href="/(tabs)" />;
}
