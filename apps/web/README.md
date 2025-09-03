# commit. — Web

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#project-structure">Project structure</a></li>
  </ol>
</details>

## Overview

The `commit.` web app is a static marketing website built with **Astro 5** and **Tailwind CSS**.
It showcases the `commit.` goal-tracking app with sections for hero, problem, solution, features, team, FAQ, and call-to-action.

Key highlights:

* **Mobile-responsive** across all device sizes
* **SEO-ready** with meta tags, Open Graph, and structured data
* **Component-based** via modular Astro components
* **Global performance** through deployment on **Cloudflare Workers**

## Prerequisites

* `Node.js 22+`
* `pnpm` (workspace root manages dependencies)

## Getting Started

Install dependencies from the workspace root:

```sh
pnpm install
```

Start the web app locally:

```sh
cd apps/web
pnpm dev
```

> [!NOTE]
> - `pnpm dev`: Astro dev server with hot reload
> - `pnpm preview`: production-like build served with `wrangler dev` (no hot reload)
> 
> See [Scripts](#scripts) for all commands

## Deployment

Requirements:

- `Cloudflare account`

### Manual

Requirements:

- Runnig `pnpm wrangler login` once to authenticate your `Cloudflare` account

Deploy:

```sh
pnpm deploy
```

### Automated (GitHub Actions)

Pushing to `main` triggers automatic deployment via GitHub Actions.

Required GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Setup:

1. Repo → **Settings → Secrets and variables → Actions**
2. Add the above secrets
3. Push to `main`

See [Cloudflare Workers docs](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) for details.

## Scripts
You can run these commands from `apps/web`:

```sh
# Local development (Astro dev server + HMR)
pnpm dev          # runs `astro dev`

# Build static assets for production
pnpm build        # runs `astro build`

# Production-like preview (build + wrangler dev)
pnpm preview      # runs `astro build && wrangler dev`

# Deploy to Cloudflare Workers
pnpm deploy       # runs `astro build && wrangler deploy`

# Code formatting
pnpm format       # runs Prettier with workspace ignore path

# Linting
pnpm lint         # runs Prettier check + ESLint
```

> [!TIP]
> To see all commands including less common, run:
> ```sh
> pnpm run
> ```

## Project Structure

```
apps/web/
├─ public/                 # Static assets (images, icons, etc.)
├─ src/
│  ├─ assets/              # Optimized images/resources
│  ├─ components/          # Reusable Astro components
│  │  ├─ sections/         # Page sections (Hero, Problem, etc.)
│  │  ├─ ui/               # UI components (Button, etc.)
│  │  ├─ Header.astro
│  │  └─ Footer.astro
│  ├─ layouts/             # Base layouts (SEO, metadata)
│  ├─ pages/               # Route pages (index.astro, etc.)
│  ├─ styles/              # Global CSS + Tailwind
│  └─ env.d.ts
├─ astro.config.mjs        # Astro config
├─ tailwind.config.js      # Tailwind CSS config
├─ wrangler.jsonc          # Cloudflare Workers config
├─ eslint.config.mjs       # ESLint config
├─ tsconfig.json           # TypeScript config
└─ package.json
```
