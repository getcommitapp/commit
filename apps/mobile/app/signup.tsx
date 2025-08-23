import React, { useCallback, useEffect, useState } from "react";
import { Image, SafeAreaView, View, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";

import {
  Text,
  useThemeColor,
  spacing,
  radii,
  textVariants,
} from "@/components/Themed";
import { signInWithGoogleOAuth, signInWithApple } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import GoogleIcon from "@/assets/icons/google.svg";
import AppleIcon from "@/assets/icons/person-circle.svg";

function getReadableAuthError(error: unknown): string {
  const message =
    typeof error === "string"
      ? error
      : ((error as { message?: string })?.message ?? "");

  const normalized = message.toLowerCase();

  if (normalized.includes("cancell") || normalized.includes("cancelled")) {
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const navigateAfterSignIn = useCallback(async () => {
    const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
    if (hasSeen === "true") {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/onboarding/1");
    }
  }, [router]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigateAfterSignIn();
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigateAfterSignIn]);

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
          <Button
            style={{ backgroundColor: "#ffffff" }}
            textStyle={{ color: "#000000" }}
            leftIcon={<GoogleIcon width={22} height={22} />}
            title="Sign in with Google"
            disabled={isGoogleLoading || isAppleLoading}
            onPress={async () => {
              if (isGoogleLoading) return;
              setIsGoogleLoading(true);
              try {
                await signInWithGoogleOAuth();
              } catch (error) {
                Alert.alert("Couldn't sign in", getReadableAuthError(error));
              } finally {
                setIsGoogleLoading(false);
              }
            }}
          />

          {Platform.OS === "ios" && (
            <Button
              style={{ backgroundColor: "#000000" }}
              leftIcon={<AppleIcon width={22} height={22} color="#FFFFFF" />}
              title="Sign in with Apple"
              disabled={isAppleLoading || isGoogleLoading}
              onPress={async () => {
                if (isAppleLoading) return;
                setIsAppleLoading(true);
                try {
                  await signInWithApple();
                } catch (error) {
                  Alert.alert("Couldn't sign in", getReadableAuthError(error));
                } finally {
                  setIsAppleLoading(false);
                }
              }}
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
