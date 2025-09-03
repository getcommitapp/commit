# commit. — Mobile

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#development-setup">Development Setup</a></li>
    <li><a href="#environment-variables">Environment Variables</a></li>
    <li><a href="#development-with-expo-go">Development with Expo Go</a></li>
    <li><a href="#production--release">Production & Release</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#mvp-features">MVP Features</a></li>
  </ol>
</details>

## Overview

The `commit.` mobile app is built with `Expo` + `React Native`, using `TypeScript` for types, `expo-router` for navigation, `Better Auth` for authentication, and `Stripe` for payments.

Key highlights:

- Quick iteration locally on device or simulator using `Expo`
- `Google` & `Apple` authentication with `Better Auth`
- Goal and group management with stake handling
- Payment integration using `Stripe`
- Verification system (time, duration, photo)
- Reviewer interface for goal verification
- Supports both solo and group goals

## Prerequisites

- `Node.js 22+`
- `pnpm` (workspace root manages dependencies)
- `Expo Go` on a phone or simulator
- Access to the backend (see [`apps/api`](https://github.com/getcommitapp/commit/apps/api/README.md))

## Getting Started

Install dependencies from the workspace root:

```sh
pnpm -w install
```

Start the mobile app:

```sh
cd apps/mobile
pnpm start
```

> [!TIP]
> Use `--clear` to reset the cache and reload the app if needed. See [Scripts](#scripts) for all commands.

## Development Setup

The mobile app relies on the `commit.` API backend. First, create your environment configuration, then choose your development approach.

### Environment Variables

Create a local `.env` from the example:

```sh
cd apps/mobile
cp .env.local.example .env.local
```

Variables:

- `EXPO_PUBLIC_API_URL` (required): Mobile app API endpoint
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` (required): `Stripe` key
- `EXPO_PUBLIC_DEV_RESET_ONBOARDING_ON_RELOAD` (optional, dev-only)
- `EXPO_PUBLIC_DEV_DEFAULT_PAGE` (optional, dev-only)
- `EXPO_PUBLIC_DEV_AUTO_AUTH_AS_TEST_USER` (optional, dev-only)
  - `user@commit.local` → regular user
  - `reviewer@commit.local` → reviewer role

### Development with Expo Go

Depending on your setup, use one of the following options:

**Option 1: Same Network (Local API)**

If your computer and mobile device are on the same network:

1. Start the API locally:

   ```sh
   cd apps/api
   pnpm dev --ip <your_computer_ip>
   ```

2. Update your `.env.local` to use your computer's IP:

   ```sh
   EXPO_PUBLIC_API_URL=http://<your_computer_ip>:8787
   ```

3. Start the mobile app:
   ```sh
   cd apps/mobile
   pnpm start
   ```

> [!TIP]
> Avoids tunnels and gives faster development cycles.

**Option 2: Personal Preview API**

If your device cannot reach your local machine, use the deployed preview API:

1. Get your preview URL from `Cloudflare` dashboard (custom link)
2. Start the API in preview environment:

   ```sh
   cd apps/api
   pnpm deploy:preview
   ```

3. Update your `.env.local` to use the preview URL, for example:

   ```sh
   EXPO_PUBLIC_API_URL=https://commit-api-preview.leo-c50.workers.dev
   ```

4. Start the mobile app:
   ```sh
   cd apps/mobile
   pnpm start --tunnel
   ```

> [!IMPORTANT]
> Never use `localhost` as the IP address on the API as there will not be a connection with your physical device.

## Production & Release

Required GitHub Secrets:

- `EXPO_TOKEN`: Required for `EAS` builds

Setup:

1. Repo → Settings → Secrets and variables → Actions
2. Add the required secrets
3. Push to `main`

### EAS Build (Production APK)

Building a production APK for Android uses `EAS` and the `eas.json` configuration.

Setup:

1. Open `apps/mobile/eas.json`
2. Replace `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` with production values:
   ```json
   "env": {
     "EXPO_PUBLIC_API_URL": "<your_production_api_url>",
     "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY": "<your_production_stripe_publishable_key>"
   }
   ```
3. `GitHub Actions` CI (`Build APK`) will use this configuration when pushed to `main`

### Automated (GitHub Actions)

Build APK CI:
Pushing to `main` triggers the `Build Mobile` workflow for CI verification and artifact previews.

Manual, version-aligned release flow:

1. Bump version in `apps/mobile` (updates both `app.json` and `package.json`):

   ```sh
   # from apps/mobile/
   VERSION=x.y.z pnpm run release:bump
   ```

2. Commit and merge the bump to `main`.

3. In `GitHub Actions`, run the workflow "Release Mobile" (workflow_dispatch).
   - It validates versions, creates tag `mobile-v{version}`, uses the APK from the last `Build APK` CI, and publishes a `GitHub` Release.

4. Download artifact from the `GitHub` Release:
   - `commit-android-{version}.apk`

> [!NOTE]
>
> - The release workflow leverages the APK artifact from the most recent `Build Mobile` CI run.
> - The release job is `release-android` in `.github/workflows/release-mobile.yml`.

## Scripts

You can run these commands from `apps/mobile`:

```sh
# Development
pnpm start                 # Launch `Expo` dev server
pnpm android               # Run on Android device/emulator
pnpm ios                   # Run on iOS device/simulator
pnpm web                   # Run in web browser

# Quality
pnpm lint                  # runs `Prettier` check + `ESLint`
pnpm format                # runs `Prettier` with workspace ignore path

# Tests
pnpm test                  # Run test suite

# Release
pnpm release:bump          # Bump version in app.json & package.json
```

> [!TIP]
> To see all commands including less common, run:
>
> ```sh
> pnpm run
> ```

## Project Structure

```
apps/mobile/
├─ app/                    # expo-router routes
│  ├─ (tabs)/              # Tab navigation (home, goals, groups, reviews, profile)
│  ├─ checkin/             # Check-in flow
│  ├─ onboarding/          # Onboarding screens
│  ├─ _layout.tsx
│  ├─ +html.tsx
│  ├─ +not-found.tsx
│  └─ signup.tsx
├─ components/             # Reusable UI components
│  ├─ auth/
│  ├─ goals/
│  ├─ groups/
│  ├─ layouts/
│  ├─ navigation/
│  ├─ pages/
│  ├─ providers/
│  └─ ui/
├─ lib/                    # Utilities & config
│  ├─ hooks/
│  ├─ api.ts
│  ├─ auth-client.ts
│  └─ utils.ts
├─ assets/
├─ constants/
├─ types/
├─ __tests__/
├─ config.ts
├─ app.json
├─ tsconfig.json
└─ eslint.config.cjs
```

## MVP Features

Authentication & Payment:

- Server: `Better Auth` handlers in `apps/api` mounted under `/api/auth/*`
- Client: initialized in `apps/mobile/lib/auth-client.ts` with `expo-secure-store` and `Stripe` integration
- Providers: `Google` & `Apple` authentication
- Payment: `Stripe` for handling payment methods and transaction processing

Features:

- Goal management: Solo & group goals with uniform stakes
- Verification system: Time, photo evidence and movement detection
- Review system: Reviewer interface for approving/rejecting photo evidence
- Group functionality: Create/join groups with a shared goal

> Full spec: [software-requirements-specification.md](../../docs/software-requirements-specification.md)
