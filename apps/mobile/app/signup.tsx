import React, { useCallback, useEffect } from "react";
import { Image, SafeAreaView, View, Platform } from "react-native";
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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import GoogleIcon from "@/assets/icons/google.svg";

export default function SignupScreen() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const navigateToApp = useCallback(async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(tabs)");
  }, [router]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigateToApp();
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [navigateToApp]);

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
            source={require("../assets/images/icon.png")}
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
            onPress={async () => {
              try {
                await signInWithGoogleOAuth();
              } catch (_) {}
            }}
          />

          {Platform.OS === "ios" && (
            <Button
              style={{ backgroundColor: "#000000" }}
              leftIcon={<FontAwesome name="apple" size={22} color="#FFFFFF" />}
              title="Sign in with Apple"
              onPress={async () => {
                try {
                  await signInWithApple();
                } catch (_) {}
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
