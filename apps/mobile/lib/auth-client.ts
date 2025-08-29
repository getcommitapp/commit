import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { stripeClient } from "@better-auth/stripe/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "commit",
      storagePrefix: "commit",
      storage: SecureStore,
    }),
    stripeClient({ subscription: false }),
  ],
});
