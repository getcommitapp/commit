import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

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

export async function signInWithGoogleOAuth(): Promise<void> {
  const redirectUrl = "commit://auth/callback";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error) throw error;
  if (!data?.url) throw new Error("No OAuth URL received from Supabase");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl, {
    showTitle: false,
    toolbarColor: "#4285F4",
    controlsColor: "#ffffff",
  });

  if (result.type === "success" && result.url) {
    const { accessToken, refreshToken, code } = parseAuthResult(result.url);
    if (accessToken && refreshToken) {
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (setSessionError) throw setSessionError;
    } else if (code) {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
    } else {
      throw new Error("No authentication credentials found in callback URL");
    }
  } else if (result.type === "cancel" || result.type === "dismiss") {
    // user canceled/dismissed
    return;
  }
}

export async function signInWithApple(): Promise<void> {
  try {
    const AppleAuth = await import("expo-apple-authentication");
    const credential = await AppleAuth.signInAsync({
      requestedScopes: [
        AppleAuth.AppleAuthenticationScope.FULL_NAME,
        AppleAuth.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) throw new Error("No identityToken");

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });
    if (error) throw error;
  } catch (e: any) {
    if (e?.code === "ERR_REQUEST_CANCELED") return;
    throw e;
  }
}
