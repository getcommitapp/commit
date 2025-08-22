<p align="center">
  <img src="docs/assets/commit-logo.png" alt="Commit logo" width="200" />
</p>

<div align="center">
  <img src="https://img.shields.io/badge/HEIG_VD-Engineering school-informational?style=for-the-badge&logo=bookstack&logoColor=white&color=darkred">
  <img src="https://img.shields.io/badge/PDG-2025-informational?style=for-the-badge&logo=moodle&logoColor=white&color=blue">
  <img src="https://img.shields.io/badge/Status-In developpment-informational?style=for-the-badge&logo=rocket&logoColor=white&color=purple">
</div>

<p align="center"><em>Goal-tracking app with financial stakes and private group challenges.</em></p>

# commit.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#quick-links">Quick links</a></li>
    <li><a href="#monorepo-layout">Monorepo layout</a></li>
    <li><a href="#tech-stack">Tech stack</a></li>
    <li>
        <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#how-to-download-the-mobile-app">How to download the mobile app</a></li>
        <li>
            <a href="#for-developers">For Developers</a>
          <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#running-on-local-machine">Running on local machine</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="#cicd-pipeline">CI/CD Pipeline</a></li>
    <li>
        <a href="#documentation">Documentation</a>
      <ul>
        <li><a href="#software-requirements-specification">Software requirements specification</a></li>
        <li><a href="#system-architecture">System Architecture</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#team">Team</a></li>
  </ol>
</details>

## Introduction

Have you ever set goals like going to the gym or waking up early, only to fail due to lack of accountability, consequences, or consistency? Our mobile application solves this problem by making commitments count—stake real money on your goals and verify progress with clear rules. See our [landing page](https://commit.leo-c50.workers.dev/) for more information.

## Quick links

- Software Requirements Specification (SRS): [PDF](./docs/software-requirements-specification.pdf) • [Markdown](./docs/software-requirements-specification.md)
- Architecture overview: [docs/architecture.md](./docs/architecture.md)
- Mockup Application: [Figma URL](https://www.figma.com/design/38qR8zRDGd07ihkDjtzPQ5/commit)
- Mobile Application: [apps/mobile/README.md](./apps/mobile/README.md)
- Web Landing Page: [apps/web/README.md](./apps/web/README.md)

## Monorepo layout

```text
    .
    ├─ apps/
    │  ├─ mobile/   # Expo + React Native (iOS/Android)
    │  └─ web/      # Astro landing (Cloudflare Workers)
    ├─ docs/        # SRS, architecture, flow, assets
    └─ package.json
```

## Tech stack

### Mobile App

<div align="center">
  <img src="https://img.shields.io/badge/Framework-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Expo-informational?style=for-the-badge&logo=expo&logoColor=black&color=A1FFEB">
  <img src="https://img.shields.io/badge/React Native-informational?style=for-the-badge&logo=react&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Language-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/TypeScript-informationa?style=for-the-badge&logo=typescript&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Testing-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Jest-informationa?style=for-the-badge&logo=jest&logoColor=black&color=A1FFEB">
</div>

### Backend & Services

<div align="center">
  <img src="https://img.shields.io/badge/Backend-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Supabase-informationa?style=for-the-badge&logo=supabase&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Database-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/PostgreSQL-informationa?style=for-the-badge&logo=postgresql&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Payments-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Stripe-informationa?style=for-the-badge&logo=stripe&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Payments Methods-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/TWINT (CH)-informationa?style=for-the-badge&color=A1FFEB">
</div>

> [!NOTE]
> `Supabase` is used for `Auth`, `Database`, `Storage` and `Edge Functions`.

> [!WARNING]
> Only `TWINT` is is supported for payments.

### Web

<div align="center">
  <img src="https://img.shields.io/badge/Framework-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Astro-informational?style=for-the-badge&logo=astro&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Hosting-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Cloudflare Workers-informationa?style=for-the-badge&logo=cloudflareworkers&logoColor=black&color=A1FFEB">
</div>

### Development Tools

<div align="center">
  <img src="https://img.shields.io/badge/Runtime-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Node.js 22+-informationa?style=for-the-badge&logo=nodedotjs&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Package Manager-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/pnpm-informationa?style=for-the-badge&logo=pnpm&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Code Quality-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/ESLint-informationa?style=for-the-badge&logo=eslint&logoColor=black&color=A1FFEB">
  <img src="https://img.shields.io/badge/Prettier-informationa?style=for-the-badge&logo=prettier&logoColor=black&color=A1FFEB">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Version Control-informational?style=for-the-badge&color=gray">
  <img src="https://img.shields.io/badge/Git-informationa?style=for-the-badge&logo=git&logoColor=black&color=A1FFEB">
  <img src="https://img.shields.io/badge/GitHub-informationa?style=for-the-badge&logo=github&logoColor=black&color=A1FFEB">
</div>

## Getting started

### How to download the mobile app

1. On your phone, open the [GitHub Releases page](https://github.com/getcommitapp/commit/releases).
2. Tap the latest release (the one at the top, marked `Latest`).
3. Under Assets, download the `.apk` file for your `Android` device.

> [!WARNING]
> Deployment to `Apple (iOS)` is not yet supported.

### For Developers

#### Prerequisites

| Tool                        | Version | Component  |
| --------------------------- | ------- | ---------- |
| Git                         | -       | All        |
| Node.js                     | 22+     | All        |
| pnpm                        | 10+     | All        |
| Cloudflare account          | -       | Web        |
| Expo Go (install on mobile) | -       | Mobile App |
| Supabase account            | -       | Mobile App |
| OAuth Google                | -       | Mobile App |
| OAuth Apple                 | -       | Mobile App |

> [!NOTE]
> You can install `pnpm` through `npm`: `npm install -g pnpm@latest` or through your OS package manager.

> [!TIP]
> Prefer `pnpm` at the workspace root to install all dependencies at once.

#### Running on local machine

```bash
# Install dependencies (run from project root)
pnpm install
```

> [!TIP]
> See app-specific guides after installing: [`apps/mobile/README.md`](./apps/mobile/README.md) and [`apps/web/README.md`](./apps/web/README.md).

## CI/CD Pipeline

| Pipeline       | CI        | CD              | Description                                                     |
| -------------- | --------- | --------------- | --------------------------------------------------------------- |
| Lint and tests | Y         | N               | PRs must pass `ESLint` and `Jest` before review.                |
| Build APK      | Y (build) | Y (tag release) | Build the APK and create a tag release in this repo             |
| Compile Docs   | Y         | N               | Compile the `PDF` for the `Software Requirements Specification` |
| Deploy web     | N         | Y               | Deploy the landing page to `CloudFlare`                         |

> [!NOTE]
> To catch issues early (Lint and tests), use the following commands:
>
> ```bash
> # Lint everything
> pnpm lint
>
> # Run mobile tests
> pnpm test
> ```

## Documentation

Comprehensive project documentation is available in the `docs/` folder.

### Software requirements specification

Complete project requirements and specifications document.

- PDF Format: [software-requirements-specification.pdf](./docs/software-requirements-specification.pdf)
- Markdown Format: [software-requirements-specification.md](./docs/software-requirements-specification.md)

### System Architecture

Technical architecture documentation including system design and workflows.

- Document: [architecture.md](./docs/architecture.md)
- Includes:
  - System Architecture diagram
  - Database Schema (MCD)
  - Branch-Based CI/CD Flow
  - Main Branch CI/CD Flow

### Additional Resources

- User flow (screens): [docs/flow.txt](./docs/flow.txt)

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Create an issue on the main repository using the available templates to describe your proposed change
2. Wait for maintainer feedback (optional but recommended for large changes)
3. Fork the repository to your GitHub account
4. Clone the forked repository to your local machine (`git clone <your-fork-url>`)
5. Create a new branch referencing the issue (`git checkout -b feature/AmazingFeature-#123`)
6. Make your changes (add or edit code)
7. Format your changes (`pnpm format`)
8. Commit your Changes, see [conventional naming](https://www.conventionalcommits.org/en/v1.0.0/) (`git commit -m "feat: add some AmazingFeature"`)
9. Push the branch to your fork (`git push origin feature/AmazingFeature`)
10. Open a Pull Request from your fork to the main repository
11. Wait for a reviewer to assess your changes

## License

Distributed under the MIT License. See `LICENSE` tab for more information.

## Team

- [David Schildböck](https://github.com/shadowkudo)
- [Leonard Cseres](https://github.com/leonardcser)
- [Tristan Gerber](https://github.com/TriGerber)
- [Aladin Iseni](https://github.com/aladin-heig)
