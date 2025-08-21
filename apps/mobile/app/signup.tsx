import React, { useCallback, useEffect } from "react";
import { Image, Pressable, SafeAreaView, View, Platform } from "react-native";
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
          justifyContent: "space-between",
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
            Welcome to Commit
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
          <Pressable
            onPress={async () => {
              try {
                await signInWithGoogleOAuth();
              } catch (_) {}
            }}
            style={({ pressed }) => ({
              backgroundColor: background,
              borderRadius: radii.md,
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.xl,
              opacity: pressed ? 0.9 : 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.md,
              borderWidth: 1,
              borderColor: border,
            })}
          >
            <FontAwesome name="google" size={22} color="#00000" />
            <Text style={[textVariants.headline]}>Continue with Google</Text>
          </Pressable>

          {Platform.OS === "ios" && (
            <Pressable
              onPress={async () => {
                try {
                  await signInWithApple();
                } catch (_) {}
              }}
              style={({ pressed }) => ({
                backgroundColor: "#000000",
                borderRadius: radii.md,
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
                opacity: pressed ? 0.9 : 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.md,
                borderWidth: 1,
                borderColor: "#000000",
              })}
            >
              <FontAwesome name="apple" size={22} color="#FFFFFF" />
              <Text style={[textVariants.headline, { color: "#FFFFFF" }]}>
                Continue with Apple
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
