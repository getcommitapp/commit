# Mobile Application

Expo + React Native app for the `commit.` project.

## Table of contents

<!-- mtoc-start -->

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Lint & tests](#lint--tests)
- [Project structure](#project-structure)
- [MVP features](#mvp-features)

<!-- mtoc-end -->

## Overview

This app uses `expo-router` for navigation, TypeScript for types, and Jest for tests.

> "Build, preview, iterate." Start locally with Expo and iterate quickly on device or simulator.

## Prerequisites

- Node.js 22+ and [pnpm](https://pnpm.io/installation)
- [Expo Go](https://expo.dev/client) on a phone, or an iOS/Android simulator

> [!TIP]
> Prefer installing dependencies from the workspace root to share the lockfile.

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
> `--tunnel` helps devices connect over different networks; you can omit it on simulators.

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

Full specification: see [software-requirements-specification.md](../../docs/software-requirements-specification.md)
