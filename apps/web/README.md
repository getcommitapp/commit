# commit. — Web (Astro + Cloudflare Workers)

Single-page marketing/landing site. Built with Astro and deployed to Cloudflare Workers.

## Table of contents

<!-- mtoc-start -->

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Lint & tests](#lint--tests)
- [Project structure](#project-structure)

<!-- mtoc-end -->

## Overview

Astro 5 app targeting the Cloudflare Workers runtime via `@astrojs/cloudflare`. Ideal for a fast, static-first landing page with edge deployment.

> "Fast by default." Keep pages lean; ship only what the landing needs.

## Prerequisites

- Node.js 22+ and pnpm
- Cloudflare account and `wrangler` CLI (installed via devDeps)

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

This package uses ESLint and Prettier:

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
