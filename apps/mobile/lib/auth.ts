import { authClient } from "@/lib/auth-client";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogleOAuth(): Promise<void> {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/(tabs)/home",
  });
}

export async function signInWithApple(): Promise<void> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error("No identityToken returned by Apple");
    }

    await authClient.signIn.social({
      provider: "apple",
      idToken: {
        token: credential.identityToken,
        // nonce can be added here if you generated one for the request
      },
      callbackURL: "/(tabs)/home",
    });
  } catch (error) {
    throw error;
  }
}
