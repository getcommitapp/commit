# commit. — Monorepo (MVP, PDG HEIG-VD)

Commit is a goal-tracking app with financial stakes and private group challenges.  
There is a mobile part (Expo/React Native), a web part (Astro on Cloudflare Workers), and a backend (Supabase + Stripe).

---

## Quick links

- Software Requirements Specification (SRS): [PDF](./docs/software-requirements-specification.pdf) • [Markdown](./docs/software-requirements-specification.md)
- Architecture overview: [docs/architecture.md](./docs/architecture.md)
- User flow (screens): [docs/flow.txt](./docs/flow.txt)
- Mobile app (Expo): [apps/mobile/README.md](./apps/mobile/README.md)
- Web landing (Astro): [apps/web/README.md](./apps/web/README.md)

---

## Monorepo layout

    .
    ├─ apps/
    │  ├─ mobile/   # Expo + React Native (iOS/Android)
    │  └─ web/      # Astro landing (Cloudflare Workers)
    ├─ docs/        # SRS, architecture, flows, assets
    └─ package.json

---

## Tech stack

- Mobile: Expo, React Native, TypeScript
- Backend: Supabase
- Payments: Stripe Connect (CHF / TWINT in CH)
- Web: Astro, Cloudflare Workers
- Tooling: Node 22+, pnpm, ESLint + Prettier, Jest (mobile)

See the SRS for roles, scope, and constraints.

---

## Prerequisites

- Node.js 22+ and pnpm (install pnpm with: npm install -g pnpm@latest-10)
- Git
- For web: Cloudflare account for deploys

---

## Setup

    # Install workspace dependencies
    pnpm install

---

## Lint & tests

CI runs lint + tests on PRs, on git push and on deployment.

To lint and test manually, use the commands below in the root directory:

    # Lint everything
    `pnpm lint`

    # Tests
    `pnpm test`

---

## Contributing
![alt text](docs/assets/issue.png)
- Open an issue → complete its description → branch from it → PR with review + passing CI

---

## Team

Leonard Cseres • Tristan Gerber • Aladin Iseni • David Schildböck