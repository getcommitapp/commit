import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onSignInSuccess?: () => void;
  onSignInError?: (error: string) => void;
};

function parseAuthResult(url: string) {
  try {
    const split = url.split("#");
    const basePart = split[0];
    const hashPart = split[1] || "";
    const urlObj = new URL(basePart);
    const params = new URLSearchParams(urlObj.search);
    if (hashPart) {
      const hashParams = new URLSearchParams(hashPart);
      hashParams.forEach((v, k) => params.set(k, v));
    }
    const accessToken = params.get("access_token") || undefined;
    const refreshToken = params.get("refresh_token") || undefined;
    const code = params.get("code") || undefined;
    return { accessToken, refreshToken, code };
  } catch (_) {
    return {} as { accessToken?: string; refreshToken?: string; code?: string };
  }
}

export function GoogleButton({ onSignInSuccess, onSignInError }: Props) {
  const [loading, setLoading] = useState(false);

  const finalizeAuthFromUrl = useCallback(
    async (url: string) => {
      const { accessToken, refreshToken, code } = parseAuthResult(url);
      if (!accessToken && !refreshToken && !code) return false;
      try {
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        return true;
      } catch (err: any) {
        onSignInError?.(err.message);
        return false;
      }
    },
    [onSignInError]
  );

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setLoading(false);
        onSignInSuccess?.();
      } else if (event === "SIGNED_OUT") {
        setLoading(false);
      }
    });

    const linkingSubscription = Linking.addEventListener(
      "url",
      async (event) => {
        const handled = await finalizeAuthFromUrl(event.url);
        if (handled) setLoading(false);
      }
    );

    return () => {
      data.subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, [finalizeAuthFromUrl, onSignInSuccess]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUrl = "commit://auth/callback";
      const calculated = makeRedirectUri({
        scheme: "commit",
        path: "auth/callback",
      });
      if (calculated !== redirectUrl) {
        console.log("[Google OAuth] calculated redirect differs:", calculated);
      }
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("No OAuth URL received from Supabase");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
        {
          showTitle: false,
          toolbarColor: "#4285F4",
          controlsColor: "#ffffff",
        }
      );

      if (result.type === "success" && result.url) {
        const handled = await finalizeAuthFromUrl(result.url);
        if (!handled)
          throw new Error(
            "No authentication credentials found in callback URL"
          );
      } else {
        setLoading(false);
      }
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
