// In development, reset onboarding on reload only if the env var is defined.
// Outside development, this is always false.
const devResetOnboardingOnReload = __DEV__
  ? process.env.EXPO_PUBLIC_DEV_RESET_ONBOARDING_ON_RELOAD !== undefined
  : false;

// In development, allow overriding the initial route if the env var is set.
const devDefaultPage = __DEV__
  ? (process.env.EXPO_PUBLIC_DEV_DEFAULT_PAGE ?? null)
  : null;

export const config = {
  devResetOnboardingOnReload,
  devDefaultPage: devDefaultPage as string | null,
} as const;
