import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { authClient } from "@/lib/auth-client";

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
        callbackURL: "/(tabs)/home",
      });
      onSignInSuccess?.();
    } catch (error: any) {
      const message = error?.message || "An unknown error occurred";
      Alert.alert("Google Sign-In Error", message);
      onSignInError?.(message);
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.googleButton, loading && styles.buttonDisabled]}
      onPress={signInWithGoogle}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 240,
    height: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "white",
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GoogleButton;
