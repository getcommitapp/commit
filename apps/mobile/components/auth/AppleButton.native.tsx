import React from "react";
import { Alert, Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";

type Props = {
  onSignInSuccess?: () => void;
  onSignInError?: (error: string) => void;
};

export default function AppleButton({ onSignInSuccess, onSignInError }: Props) {
  if (Platform.OS !== "ios") return null;

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={{ width: 240, height: 48 }}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          if (!credential.identityToken) throw new Error("No identityToken");

          const { error } = await supabase.auth.signInWithIdToken({
            provider: "apple",
            token: credential.identityToken,
          });
          if (error) throw error;
          onSignInSuccess?.();
        } catch (e: any) {
          if (e?.code === "ERR_REQUEST_CANCELED") return;
          const message =
            e?.message || "An error occurred during Apple sign-in";
          onSignInError?.(message);
          Alert.alert("Apple Sign-In Error", message);
        }
      }}
    />
  );
}
