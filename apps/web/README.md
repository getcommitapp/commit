# commit. — Web

Marketing/landing website for the commit. goal tracking app. Built with `Astro 5` and `Tailwind CSS`, deployed as static assets to `Cloudflare Workers`.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#lint--tests">Lint & tests</a></li>
    <li><a href="#project-structure">Project structure</a></li>
  </ol>
</details>

## Overview

The commit. web app is a static marketing website built with Astro 5 and Tailwind CSS. It showcases the commit. goal tracking app with multiple sections including hero, problem statement, solution overview, features, team, FAQ, and call-to-action.

Key features:

- **Static build**: Generates static HTML/CSS/JS for optimal performance
- **Mobile-responsive**: Optimized for all device sizes
- **SEO-optimized**: Meta tags, Open Graph, and structured data
- **Component-based**: Modular Astro components for maintainability
- **Cloudflare deployment**: Static assets deployed to Cloudflare Workers

> [!NOTE]  
> The site is built as static assets and deployed to Cloudflare Workers for global edge performance.

## Prerequisites

- `Node.js 22+` and `pnpm`
- `Cloudflare account` and `wrangler CLI` (for deployment)

> [!TIP]  
> Dependencies are managed from the workspace root using pnpm workspaces.

## Getting started

From the workspace root:

```bash
pnpm install
```

Then start the web app:

```bash
cd apps/web
pnpm dev
```

> [!NOTE]
> For a production-like preview, use `pnpm preview` which builds and runs `wrangler dev` locally.

## Scripts

Available scripts in this package:

```bash
# Local development
pnpm dev

# Build for production
pnpm build

# Production-like preview (build + wrangler dev)
pnpm preview

# Deploy to Cloudflare Workers (build + wrangler deploy)
pnpm deploy

# Utilities
pnpm lint
pnpm format
pnpm cf-typegen
```

## Lint & tests

This package uses `ESLint` and `Prettier`:

```bash
pnpm lint
pnpm format
```

## Project structure

    apps/web/
    ├─ public/                  # static assets (images, icons, etc.)
    ├─ src/
    │  ├─ assets/              # optimized images and resources
    │  ├─ components/          # reusable Astro components
    │  │  ├─ sections/         # page sections (Hero, Problem, etc.)
    │  │  ├─ ui/               # UI components (Button, etc.)
    │  │  ├─ Header.astro
    │  │  └─ Footer.astro
    │  ├─ layouts/
    │  │  └─ Layout.astro      # base HTML layout with SEO
    │  ├─ pages/
    │  │  └─ index.astro       # main landing page
    │  ├─ styles/              # global CSS and Tailwind
    │  └─ env.d.ts
    ├─ astro.config.mjs        # Astro configuration
    ├─ tailwind.config.js      # Tailwind CSS configuration
    ├─ wrangler.jsonc          # Cloudflare Workers deployment config
    ├─ eslint.config.mjs       # ESLint configuration
    ├─ tsconfig.json          # TypeScript configuration
    └─ package.json

## Contributing

The web app is deployed automatically via GitHub Actions when changes are pushed to the main branch. For manual deployment:

1. Ensure you have the correct Cloudflare Workers environment variables configured
2. Run `pnpm deploy` to build and deploy to Cloudflare Workers

Refer to the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) for GitHub Actions integration details.
