# commit. — Web

Single-page marketing/landing site. Built with `Astro` and deployed to `Cloudflare Workers`.

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

Astro 5 is targeting the Cloudflare Workers runtime via `@astrojs/cloudflare`. Ideal for a fast, static-first landing page with edge deployment.

> "Fast by default." Keep pages lean; ship only what the landing needs.

## Prerequisites

- `Node.js 22+` and `pnpm`
- `Cloudflare account` and `wrangler CLI` (installed via DevDeps)

> [!TIP]
> Prefer installing dependencies from the workspace root to share the lockfile.

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
    ├─ public/
    ├─ src/
    │  └─ pages/
    │     └─ index.astro        # landing page
    ├─ astro.config.mjs
    ├─ wrangler.jsonc
    ├─ worker-configuration.d.ts
    ├─ eslint.config.mjs
    ├─ tsconfig.json
    └─ package.json

## Contributing

If you clone this repository, you'll need to update environment variables in the web deployment pipeline for your own Cloudflare Workers setup.

Refer to the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) for GitHub Actions integration details.
