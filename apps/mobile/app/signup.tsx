import React, { useCallback } from "react";
import { View, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";

import {
  Text,
  useThemeColor,
  spacing,
  radii,
  textVariants,
} from "@/components/Themed";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { AppleButton } from "@/components/auth/AppleButton.native";

function getReadableAuthError(error: unknown): string {
  const message =
    typeof error === "string"
      ? error
      : ((error as { message?: string })?.message ?? "");

  const normalized = message.toLowerCase();

  if (normalized.includes("cancel") || normalized.includes("cancelled")) {
    return "You canceled the sign-in.";
  }
  if (normalized.includes("network") || normalized.includes("timeout")) {
    return "Network issue. Check your connection and try again.";
  }
  if (normalized.includes("popup") || normalized.includes("browser")) {
    return "We couldn't open the sign-in flow. Please try again.";
  }

  return message || "Something went wrong. Please try again.";
}

export default function SignupScreen() {
  const router = useRouter();
  const background = useThemeColor({}, "background");

  const navigateAfterSignIn = useCallback(async () => {
    const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (hasSeen === "true") {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/onboarding/1");
    }
  }, [router]);

  const handleAuthSuccess = useCallback(() => {
    navigateAfterSignIn();
  }, [navigateAfterSignIn]);

  const handleAuthError = useCallback((error: string) => {
    Alert.alert("Couldn't sign in", getReadableAuthError(error));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xl,
          gap: spacing.xxl,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginTop: spacing.xl }}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={{
              width: 96,
              height: 96,
              borderRadius: radii.lg,
              marginBottom: spacing.lg,
            }}
            contentFit="cover"
          />
          <Text style={[textVariants.title1, { textAlign: "center" }]}>
            Hi there! 👋
          </Text>
          <Text
            style={[
              { opacity: 0.8, textAlign: "center", marginTop: spacing.sm },
            ]}
          >
            Create your account to continue
          </Text>
        </View>

        <View style={{ gap: spacing.md, marginBottom: spacing.xxl }}>
          <GoogleButton
            onSignInSuccess={handleAuthSuccess}
            onSignInError={handleAuthError}
          />

          {Platform.OS === "ios" && (
            <AppleButton
              onSignInSuccess={handleAuthSuccess}
              onSignInError={handleAuthError}
            />
          )}

          <Text
            style={{
              textAlign: "center",
              marginTop: spacing.sm,
              color: useThemeColor({}, "mutedForeground"),
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
