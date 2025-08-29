// In development, reset onboarding on reload only if the env var is defined.
// Outside development, this is always false.
const devResetOnboardingOnReload = __DEV__
  ? process.env.EXPO_PUBLIC_DEV_RESET_ONBOARDING_ON_RELOAD !== undefined
  : false;

// In development, allow overriding the initial route if the env var is set.
const devDefaultPage = __DEV__
  ? (process.env.EXPO_PUBLIC_DEV_DEFAULT_PAGE ?? null)
  : null;

// In development, allow auto-authentication as a seeded test user if the env var is set.
// Set EXPO_PUBLIC_DEV_AUTO_AUTH_AS_TEST_USER to an email like:
//   - "user@commit.local" (role: user)
//   - "reviewer@commit.local" (role: reviewer)
const devAutoAuthAsTestUser = __DEV__
  ? process.env.EXPO_PUBLIC_DEV_AUTO_AUTH_AS_TEST_USER
  : false;

export const config = {
  devResetOnboardingOnReload,
  devDefaultPage: devDefaultPage as string | null,
  devAutoAuthAsTestUser,
} as const;
