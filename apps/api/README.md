# commit. - API Backend

Built with `Hono` + `Cloudflare Workers` and deployed to `Cloudflare` with `D1` database and `Better Auth` for authentication.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#database">Database</a></li>
    <li><a href="#authentication">Authentication</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#project-structure">Project structure</a></li>
  </ol>
</details>

## Overview

This API serves as the backend for the commit. mobile application, providing:

- **Authentication**: Google and Apple OAuth via Better Auth
- **Task Management**: CRUD operations for goals and commitments
- **Database**: SQLite via Cloudflare D1 with Drizzle ORM
- **API Documentation**: Auto-generated OpenAPI docs at the root endpoint

> "Edge-first, serverless backend." Built for global performance and scalability on Cloudflare's edge network.

## Prerequisites

- `Node.js 22+` and `pnpm`
- `Cloudflare account` with D1 database access
- `wrangler CLI` (installed via devDependencies)
- OAuth credentials for Google and Apple

## Getting started

From the workspace root:

```bash
pnpm install
```

### Environment Setup

Before starting the API, you need to configure environment variables:

```bash
cd apps/api
cp .dev.vars.example .dev.vars
```

Required variables in `.dev.vars`:

```bash
AUTH_GOOGLE_CLIENT_ID=your_google_client_id
AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_APPLE_CLIENT_ID=your_apple_client_id
AUTH_APPLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> [!WARNING]
> Never commit `.dev.vars` to version control. Use Cloudflare secrets for production.

### Start the API

Once environment variables are configured, start the API locally:

```bash
pnpm dev
```

> [!NOTE]
> The API will be available at `http://localhost:8787` with OpenAPI docs at the root endpoint.

### Development with Expo Go

If you're developing the mobile app using **Expo Go** on a physical device, `localhost` won't be accessible from your mobile device. In this case, you should use the **preview environment** instead:

1. **Deploy to preview environment**:

   ```bash
   pnpm deploy:preview
   ```

2. **Update mobile app configuration** to use the preview API URL by setting `EXPO_PUBLIC_API_URL=https://commit-api-preview.leo-c50.workers.dev/` in `apps/mobile/.env.local`

> [!TIP]
> The preview environment provides a publicly accessible URL that works with Expo Go on physical devices, while localhost is only accessible from simulators or devices on the same network.

## Database

The API uses Cloudflare D1 (SQLite) with Drizzle ORM for type-safe database operations.

### Schema Management

```bash
# Generate migrations from schema changes
pnpm db:generate --name <migration_name>

# Apply migrations to remote databases
pnpm db:migrate:preview    # Preview environment

# Open Drizzle Studio for database inspection
pnpm db:studio
```

### Database Environments

- **Local**: SQLite file for development
- **Preview**: Separate D1 database for staging/testing
- **Production**: Main D1 database for live users

## Deployment

The API is deployed to Cloudflare Workers with separate environments:

### Preview Environment

```bash
pnpm deploy:preview
```

- Database: `commit-api-db-preview`
- Used for testing and staging

### Production Environment

```bash
pnpm deploy:production
```

- Database: `commit-api-db`
- Used for live users

> [!IMPORTANT]
> Always test changes in preview before deploying to production.

## Project structure

    apps/api/
    ├─ src/
    │  ├─ endpoints/        # API route handlers
    │  │  ├─ taskCreate.ts
    │  │  ├─ taskDelete.ts
    │  │  ├─ taskFetch.ts
    │  │  └─ taskList.ts
    │  ├─ db/
    │  │  └─ schema.ts      # Drizzle database schema
    │  ├─ auth.ts           # Better Auth configuration
    │  ├─ index.ts          # Main application entry point
    │  ├─ types.ts          # TypeScript type definitions
    │  └─ env.d.ts          # Environment type definitions
    ├─ drizzle/             # Database migrations
    │  ├─ 0000_init.sql
    │  └─ meta/
    ├─ wrangler.jsonc       # Cloudflare Workers configuration
    ├─ drizzle.config.ts    # Drizzle ORM configuration
    ├─ package.json
    └─ tsconfig.json
