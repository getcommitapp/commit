import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  onSignInSuccess?: () => void;
  onSignInError?: (error: string) => void;
};

export function AppleButton({ onSignInSuccess, onSignInError }: Props) {
  const [loading, setLoading] = useState(false);
  if (Platform.OS !== "ios") return null;

  const signInWithApple = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) throw new Error("No identityToken");

      await authClient.signIn.social({
        provider: "apple",
        idToken: {
          token: credential.identityToken,
        },
        callbackURL: "/onboarding/1",
      });
      const session = await authClient.getSession();
      const sessionToken = session?.data?.session?.token ?? null;

      if (sessionToken) {
        onSignInSuccess?.();
        setLoading(false);
      } else {
        // Authentication was cancelled - silently return without calling success or error
        setLoading(false);
        return;
      }
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return;
      const message = e?.message || "An error occurred during Apple sign-in";
      onSignInError?.(message);
      Alert.alert("Apple Sign-In Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      title="Sign in with Apple"
      onPress={signInWithApple}
      disabled={loading}
      loading={loading}
      leftIcon={<FontAwesome name="apple" size={20} color="#FFFFFF" />}
      style={{ backgroundColor: "#000000" }}
    />
  );
}
