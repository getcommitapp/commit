import React, { useCallback } from "react";
import { Image, Pressable, SafeAreaView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";

import {
  Text,
  useThemeColor,
  spacing,
  radii,
  textVariants,
} from "@/components/Themed";

export default function SignupScreen() {
  const router = useRouter();
  const text = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const onContinue = useCallback(async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(tabs)");
  }, [router]);

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
            onPress={onContinue}
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
            <Image
              source={{
                uri: "https://static-00.iconduck.com/assets.00/google-icon-2048x2048-2ur3h1ka.png",
              }}
              style={{ width: 20, height: 20 }}
            />
            <Text style={[textVariants.headline]}>Continue with Google</Text>
          </Pressable>

          <Pressable
            onPress={onContinue}
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
            <Image
              source={{
                uri: "https://static-00.iconduck.com/assets.00/apple-icon-512x512-8mqh6h9x.png",
              }}
              style={{ width: 20, height: 20 }}
            />
            <Text style={[textVariants.headline]}>Continue with Apple</Text>
          </Pressable>

          <Text style={{ textAlign: "center", fontSize: 12, opacity: 0.7 }}>
            This is a mock screen; authentication not yet implemented.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
