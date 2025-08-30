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
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        output: true,
      },
      timezone: {
        type: "string",
        input: true,
        output: true,
        defaultValue: "UTC",
      },
    },
  },
});

// Auto-inject timezone into social sign-in calls
function resolveTimezone(): string {
  try {
    const tz = Intl?.DateTimeFormat?.().resolvedOptions().timeZone;
    return tz || "UTC";
  } catch {
    return "UTC";
  }
}

const originalSocial = authClient.signIn.social.bind(authClient.signIn);
(authClient.signIn as any).social = (args: any) => {
  const timezone = args?.timezone ?? resolveTimezone();
  return originalSocial({ ...args, timezone });
};
