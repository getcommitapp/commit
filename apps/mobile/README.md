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

This app uses `expo-router` for navigation, `TypeScript` for types, and `Jest` for tests.

> "Build, preview, iterate." Start locally with Expo and iterate quickly on device or simulator.

## Prerequisites

- `Node.js 22+` and [`pnpm`](https://pnpm.io/installation)
- [`Expo Go`](https://expo.dev/client) on a phone, or an iOS/Android simulator

### Supabase

You will need a Supabase account. Either ask to join the current oganization or create a new project.

If you create a new project, you will need to update the public variables in `lib/supabase.ts` and enable `Google and Apple` OAuth providers.

For the `Apple OAuth`, set the `Client ID` to `host.exp.Exponent`

For the `Google OAuth`, create a new Google OAuth client of type web, and set the `Client ID` and `Client Secret`.

> [!NOTE]
> See the [Expo documentation](https://docs.expo.dev/guides/using-supabase/) for more details on integrating Supabase.

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

- `EXPO_PUBLIC_DEV_RESET_ONBOARDING_ON_RELOAD` (dev-only, optional): If defined, onboarding is reset on each reload in development. Outside development, this is always ignored (feature is disabled).
- `EXPO_PUBLIC_DEV_DEFAULT_PAGE` (dev-only, optional): If defined, the app will redirect to this route on launch during development. Examples: `/signup`, `/onboarding/1`, `/(tabs)/home`.

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

- Regular `Build APK` workflow runs on `main` commits for CI verification and artifact previews.
- The release job is `release-android` in `.github/workflows/release-mobile.yml`.

## Project structure

    apps/mobile/
    ├─ app/               # expo-router routes (tabs, modals, 404)
    │  ├─ (tabs)/
    │  ├─ _layout.tsx
    │  ├─ +html.tsx
    │  ├─ +not-found.tsx
    │  └─ modal.tsx
    ├─ components/
    ├─ assets/
    ├─ constants/
    ├─ types/
    ├─ app.json
    ├─ tsconfig.json
    └─ eslint.config.cjs

## MVP features

- Sign-in: Google & Apple
- Solo and group goals; uniform stake in groups
- Verification: GPS / time / duration / photo
- Money flow: authorize stake; capture on failure; distribute to winners or fallback
- Reviewer screen: approve/reject photo evidence

Full specification: see [software-requirements-specification.md](../../docs/software-requirements-specification.md).
