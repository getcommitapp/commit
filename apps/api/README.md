# commit. — API

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#database">Database</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#project-structure">Project structure</a></li>
  </ol>
</details>

## Overview

The `commit.` API is a serverless backend built with `Hono` and deployed to `Cloudflare Workers`.
It powers the `commit.` mobile app with features for goal tracking, group management, payments, and user authentication.

Key highlights:

- Edge-first architecture for global performance via `Cloudflare's` network
- `OAuth` authentication with `Google`/`Apple` via `Better Auth` + `Stripe` integration
- Goal & group management with verification, reviews, and invite systems
- Payment processing through `Stripe` for stakes and payment methods
- File handling via `Cloudflare R2` for photo uploads
- `SQLite` database using `Cloudflare D1` with `Drizzle ORM`
- Auto-generated docs at the root endpoint with `OpenAPI` via `Chanfana`
- Scheduled tasks for automatic settlement processing

> Detailed API documentation: [application-protocol.md](https://github.com/getcommitapp/commit/docs/application_protocol.md)

## Prerequisites

- `Node.js 22+`
- `pnpm` (workspace root manages dependencies)
- `Cloudflare account` with D1 database and R2 storage access

## Getting Started

Install dependencies from the workspace root:

```sh
pnpm install
```

### Environment Setup

Configure environment variables before starting:

```sh
cd apps/api
cp .dev.vars.example .dev.vars
```

Required variables in `.dev.vars`:

```sh
AUTH_GOOGLE_CLIENT_ID=your_google_client_id
AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_APPLE_CLIENT_ID=your_apple_client_id
# AUTH_APPLE_CLIENT_SECRET is optional
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> [!TIP]
> For setup guides on obtaining these credentials:
>
> - Google OAuth: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
> - Apple Sign In: [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/serviceId)
> - Stripe Keys: [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

> [!WARNING]
> Never commit `.dev.vars` to version control. Use Cloudflare secrets for production.

### Start the API

Once environment variables are configured:

```sh
pnpm dev
```

> [!NOTE]
>
> - `pnpm dev`: Local development server at `http://localhost:8787`
> - `pnpm dev:preview`: Development with preview environment
> - `OpenAPI` docs available at the root endpoint
>
> See [Scripts](#scripts) for all commands

### Development with Expo Go

For mobile development using `Expo Go` on physical devices, `localhost` won't be accessible. You have two options:

**Option 1: Same Network Development**
If your mobile device and computer are on the same network:

```sh
pnpm dev --ip <your_computer_ip>
```

Then update mobile app to use your computer's IP in `apps/mobile/.env.local`:

```sh
EXPO_PUBLIC_API_URL=http://<your_computer_ip>:8787/
```

**Option 2: Preview Environment**
For remote development or different networks:

1. Deploy to preview:

   ```sh
   pnpm deploy:preview
   ```

2. Update mobile app to use preview API URL in `apps/mobile/.env.local`:
   ```sh
   EXPO_PUBLIC_API_URL=https://commit-api-preview.leo-c50.workers.dev/
   ```

> [!TIP]
> Use Option 1 for faster development cycles, Option 2 for testing in production-like environment or when devices are on different networks.

## Database

The API uses `Cloudflare D1` (`SQLite`) with `Drizzle ORM` for type-safe database operations.

### Environments

- Local: `SQLite` file with `D1` local simulation
- Preview: `commit-api-db-preview` for staging/testing
- Production: `commit-api-db` for live users

### Common Operations

```sh
# Generate migrations from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate           # Local
pnpm db:migrate:preview   # Preview
pnpm db:migrate:production # Production

# Database inspection
pnpm db:studio

# Seed with test data
pnpm db:seed              # Local
pnpm db:seed:preview      # Preview

# Reset database
pnpm db:reset             # Local
pnpm db:reset:preview     # Preview
```

> [!NOTE]
> See [Scripts](#scripts) for the complete list of database commands.

## Deployment

The API deploys to `Cloudflare Workers` with separate environments.

Requirements:

- `Cloudflare account`

### Manual

Requirements:

- Running `pnpm wrangler login` once to authenticate your `Cloudflare` account

Deploy to environments:

```sh
pnpm deploy:preview     # Staging environment
pnpm deploy:production  # Live environment
```

> [!IMPORTANT]
> Always test changes in preview before deploying to production.

### Automated (GitHub Actions)

Pushing to `main` triggers automatic deployment via `GitHub Actions`.

Required GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- Plus environment-specific secrets for `OAuth` and `Stripe`

Setup:

1. Repo → Settings → Secrets and variables → Actions
2. Add the above secrets
3. Push to `main`

See [`Cloudflare Workers` docs](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) for details.

## Scripts

You can run these commands from `apps/api`:

```sh
# Development
pnpm dev                   # runs `wrangler dev` (local)
pnpm dev:preview           # runs `wrangler dev --env preview`
pnpm start                 # alias for `pnpm dev`

# Testing & Quality
pnpm test                  # runs `vitest run`
pnpm format                # runs `Prettier` with workspace ignore path
pnpm lint                  # runs `Prettier` check + `ESLint`

# Database Operations
pnpm db:generate           # runs `drizzle-kit generate`
pnpm db:push               # runs `drizzle-kit push`
pnpm db:studio             # runs `drizzle-kit studio`

# Local Database
pnpm db:migrate            # applies migrations + seeds local DB
pnpm db:seed               # seeds local DB with test data
pnpm db:reset              # resets local DB + migrates

# Preview Database
pnpm db:migrate:preview    # applies migrations + seeds preview DB
pnpm db:seed:preview       # seeds preview DB with test data
pnpm db:reset:preview      # resets preview DB + migrates

# Production Database
pnpm db:migrate:production # applies migrations to production DB

# Deployment
pnpm deploy:preview        # runs `wrangler deploy --env preview`
pnpm deploy:production     # runs `wrangler deploy --env production`
```

> [!TIP]
> To see all commands including less common, run:
>
> ```sh
> pnpm run
> ```

## Project Structure

```
apps/api/
├─ src/
│  ├─ endpoints/           # API route handlers
│  │  ├─ users*.ts         # User management endpoints
│  │  ├─ goals*.ts         # Goal management and verification
│  │  ├─ groups*.ts        # Group management and invites
│  │  ├─ payments*.ts      # Stripe payment integration
│  │  └─ files*.ts         # File upload and serving
│  ├─ db/
│  │  └─ schema.ts         # Drizzle database schema
│  ├─ scheduler/           # Cron job handlers
│  │  └─ settlement.ts     # Automated settlement processing
│  ├─ services/            # Business logic services
│  ├─ lib/                 # Utility functions
│  ├─ auth.ts              # Better Auth configuration
│  ├─ index.ts             # Main application entry point
│  ├─ types.ts             # TypeScript type definitions
│  └─ env.d.ts             # Environment type definitions
├─ drizzle/                # Database migrations
│  ├─ 0000_init.sql
│  └─ meta/
├─ drizzle-seed/           # Database seeding scripts
│  ├─ seed-dev-preview.sql
│  └─ reset-db.sql
├─ wrangler.jsonc          # Cloudflare Workers config
├─ drizzle.config.ts       # Drizzle ORM config
├─ vitest.config.ts        # Test config
├─ package.json
└─ tsconfig.json
```
