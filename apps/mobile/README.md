# commit. - Mobile Application

Built with `Expo` + `React Native` and deployed as a `GitHub` release (tagged in the main repo).

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#environment-variables">Environment variables</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#lint--tests">Lint & tests</a></li>
    <li><a href="#project-structure">Project structure</a></li>
    <li><a href="#mvp-features">MVP features</a></li>
  </ol>
</details>

## Overview

This app uses `expo-router` for navigation, `TypeScript` for types, `Jest` for tests, `Better Auth` for authentication, and `Stripe` for payments.

> "Build, preview, iterate." Start locally with Expo and iterate quickly on device or simulator.

## Prerequisites

- `Node.js 22+` and [`pnpm`](https://pnpm.io/installation)
- [`Expo Go`](https://expo.dev/client) on a phone, or an iOS/Android simulator

### Authentication

The app uses Better Auth with a Hono backend (Cloudflare Workers) and Stripe for payment processing.

- Server: see `apps/api` where the Better Auth handler is mounted under `/api/auth/*`.
- Client: initialized in `apps/mobile/lib/auth-client.ts` with the Expo plugin, `expo-secure-store`, and Stripe integration.
- Providers: Google and Apple authentication are configured.
- Payment: Stripe integration for payment method handling and transaction processing.

## Getting started

From the workspace root:

```bash
pnpm install
```

Then start the mobile app:

```bash
cd apps/mobile
pnpm start --tunnel
```

> [!NOTE]
> `--tunnel` helps devices connect over different networks; you can omit it on simulators or local networks.

> [!TIP]
> `--clear` clears the cache and reloads the app. Sometimes useful to reset the app state.

## Environment variables

Create a local env file from the example template:

```bash
cd apps/mobile
cp .env.local.example .env.local
```

Available variables:

- `EXPO_PUBLIC_API_URL` (required): The API URL for the mobile app to connect to.
  - Use `http://localhost:8787` for simulator/emulator development
  - Use `https://commit-api-preview.leo-c50.workers.dev/` for Expo Go on physical devices
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` (required): Stripe publishable key for payment processing
- `EXPO_PUBLIC_DEV_RESET_ONBOARDING_ON_RELOAD` (dev-only, optional): If defined, onboarding is reset on each reload in development. Outside development, this is always ignored (feature is disabled).
- `EXPO_PUBLIC_DEV_DEFAULT_PAGE` (dev-only, optional): If defined, the app will redirect to this route on launch during development. Examples: `/signup`, `/onboarding/1`, `/(tabs)/home`.
- `EXPO_PUBLIC_DEV_AUTO_AUTH_AS_TEST_USER` (dev-only, optional): If defined, the app will auto-authenticate with a seeded test user on launch during development. Set to an email to choose the role:
  - `user@commit.local` (regular user)
  - `reviewer@commit.local` (reviewer role)

## Scripts

Common scripts available in this package:

```bash
# Start the dev server (choose device in the UI)
pnpm start

# Start directly on a platform
pnpm android
pnpm ios
pnpm web

# Lint and format
pnpm lint
pnpm format

# Run tests
pnpm test
```

## Lint & tests

Run locally inside `apps/mobile/`:

```bash
pnpm lint
pnpm test
```

> [!IMPORTANT]
> Ensure a clean lint state and passing tests before opening a PR.

## Release (Android)

Manual, version-aligned release flow:

1. Bump version in `apps/mobile` (updates both `app.json` and `package.json`):
   ```bash
   # from apps/mobile/
   VERSION=x.y.z pnpm run release:bump
   ```
2. Commit and merge the bump to `main`.
3. In GitHub Actions, run the workflow "Release Mobile" (workflow_dispatch).
   - It validates versions, creates tag `mobile-v{version}`, builds, and publishes a GitHub Release.
4. Download artifact from the GitHub Release:
   - `commit-android-{version}.apk`

Notes:

- The `Build Mobile` workflow runs on `main` commits for CI verification and artifact previews.
- The `Release Mobile` workflow downloads artifacts from the build workflow and creates a tagged GitHub Release.
- Release artifacts are available as `commit-android-{version}.apk` from GitHub Releases.

## Project structure

    apps/mobile/
    ├─ app/               # expo-router routes (tabs, modals, 404)
    │  ├─ (tabs)/         # Tab navigation (home, goals, groups, reviews, profile)
    │  ├─ checkin/        # Check-in flow for goal verification
    │  ├─ onboarding/     # Onboarding screens
    │  ├─ _layout.tsx
    │  ├─ +html.tsx
    │  ├─ +not-found.tsx
    │  └─ signup.tsx
    ├─ components/        # Reusable UI components
    │  ├─ auth/           # Authentication components
    │  ├─ goals/          # Goal-related components
    │  ├─ groups/         # Group-related components
    │  ├─ layouts/        # Layout components
    │  ├─ navigation/     # Navigation components
    │  ├─ pages/          # Page-specific components
    │  ├─ providers/      # Context providers (Auth, Stripe, etc.)
    │  └─ ui/             # Base UI components
    ├─ lib/               # Utilities and configurations
    │  ├─ hooks/          # Custom React hooks
    │  ├─ api.ts          # API client
    │  ├─ auth-client.ts  # Better Auth client with Stripe
    │  └─ utils.ts        # Utility functions
    ├─ assets/
    ├─ constants/
    ├─ types/
    ├─ __tests__/         # Jest test files
    ├─ config.ts          # App configuration
    ├─ app.json
    ├─ tsconfig.json
    └─ eslint.config.cjs

## MVP features

- Authentication: Google & Apple sign-in with Better Auth
- Goal management: Solo and group goals with uniform stakes
- Payment integration: Stripe for payment method handling and stake processing
- Verification system: Time, duration, and photo verification
- Money flow: Authorize stakes, capture on failure, distribute to winners or fallback
- Review system: Reviewer interface for approving/rejecting photo evidence
- Group functionality: Create and join groups with shared goals

Full specification: see [software-requirements-specification.md](../../docs/software-requirements-specification.md).
