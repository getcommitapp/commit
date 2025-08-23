export const config = {
  // Reset onboarding flag automatically in development for faster iteration
  resetOnboardingOnReload: __DEV__,
  // Development-only default page to auto-navigate on app start.
  // Usage: set route (e.g., "/signup") to jump directly there during development.
  // Can be disabled via `enabled: false`. This entire feature is dev-only.
  devDefaultPage: __DEV__
    ? {
        enabled: true,
        // Example: "/signup", "/(tabs)", "/auth/callback"
        route: "/(tabs)/home",
      }
    : {
        enabled: false,
        route: null as string | null,
      },
} as const;
