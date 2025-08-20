# Mobile Application

This is the README for the mobile application built with Expo and React Native.

## Prerequisites

- [pnpm](https://pnpm.io/installation)
- [Expo Go](https://expo.dev/client) - on a phone, or via a simulator.

---

## Getting Started


```bash
pnpm install
```

```bash
pnpm start --tunnel # Inside commit/apps/mobile/
```

---

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

---

## MVP features

- Sign-in: Google & Apple
- Solo and group goals; uniform stake in groups
- Verification: GPS / time / duration / photo
- Money flow: authorize stake; capture on failure; distribute to winners or fallback
- Reviewer screen: approve/reject photo evidence

Full specification: see [software-requirements-specification.md](../../docs/software-requirements-specification.md)
