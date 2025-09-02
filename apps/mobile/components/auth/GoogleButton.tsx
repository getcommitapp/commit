import React, { useState } from "react";
import { Alert } from "react-native";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import GoogleIcon from "@/assets/icons/google.svg";

type Props = {
  onSignInSuccess?: () => void;
  onSignInError?: (error: string) => void;
};

export function GoogleButton({ onSignInSuccess, onSignInError }: Props) {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding/1",
      });

      // Check if authentication actually succeeded by verifying session
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
    } catch (error: any) {
      const message = error?.message || "An unknown error occurred";
      Alert.alert("Google Sign-In Error", message);
      onSignInError?.(message);
      setLoading(false);
    }
  };

  return (
    <Button
      title="Sign in with Google"
      onPress={signInWithGoogle}
      disabled={loading}
      loading={loading}
      leftIcon={<GoogleIcon width={22} height={22} />}
      style={{ backgroundColor: "#ffffff" }}
      textStyle={{ color: "#000000" }}
    />
  );
}
