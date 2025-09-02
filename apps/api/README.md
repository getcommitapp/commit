# commit. - API Backend

Built with `Hono` + `Cloudflare Workers` and deployed to `Cloudflare` with `D1` database and `Better Auth` for authentication.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#database">Database</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#scripts">Scripts</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#project-structure">Project structure</a></li>
  </ol>
</details>

## Overview

This API serves as the backend for the commit. mobile application, providing:

- **Authentication**: Google and Apple OAuth via Better Auth with Stripe integration
- **Goal Management**: CRUD operations for goals with occurrence tracking and verification
- **Group Management**: Create and manage goal groups with invite system
- **User Management**: User profiles with role-based access (user, reviewer, admin)
- **Payment Processing**: Stripe integration for stakes and payment methods
- **File Handling**: Photo upload and serving via Cloudflare R2
- **Database**: SQLite via Cloudflare D1 with Drizzle ORM
- **API Documentation**: Auto-generated OpenAPI docs at the root endpoint
- **Scheduled Tasks**: Automatic settlement processing via cron triggers

> "Edge-first, serverless backend." Built for global performance and scalability on Cloudflare's edge network.

## Prerequisites

- `Node.js 22+` and `pnpm`
- `Cloudflare account` with D1 database and R2 storage access
- `wrangler CLI` (installed via devDependencies)
- OAuth credentials for Google and Apple
- `Stripe account` for payment processing

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
# AUTH_APPLE_CLIENT_SECRET is optional
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

### Additional Infrastructure

The API also utilizes:

- **R2 Storage**: For file uploads (photos and other assets)
  - Bucket: `commit-photos` (production) / `commit-photos-preview` (preview)
- **Cron Triggers**: Scheduled settlement processing every 15 minutes
- **Development Auth**: Special header-based authentication for testing environments

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

- **Local**: SQLite file for development (with D1 local simulation)
- **Preview**: Separate D1 database for staging/testing (`commit-api-db-preview`)
- **Production**: Main D1 database for live users (`commit-api-db`)

### Additional Database Operations

```bash
# Seed database with test data
pnpm db:seed          # Local development
pnpm db:seed:preview  # Preview environment

# Reset and rebuild database
pnpm db:reset         # Local development
pnpm db:reset:preview # Preview environment

# Push schema changes directly (use with caution)
pnpm db:push
```

## API Endpoints

The API provides the following main endpoint categories:

### Authentication

- OAuth integration with Google and Apple
- Session management via Better Auth
- Development mode supports custom header authentication

### Users

- `GET /api/users` - Fetch current user profile
- `PUT /api/users` - Update user profile
- `DELETE /api/users` - Delete user account

### Goals

- `GET /api/goals` - List user's goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Fetch specific goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/checkin` - Submit check-in verification
- `POST /api/goals/:id/photo` - Submit photo verification
- `POST /api/goals/:id/movement/start` - Start movement timer
- `POST /api/goals/:id/movement/violate` - Report movement violation

### Goal Review (for reviewers)

- `GET /api/goals/review` - List goals pending review
- `PUT /api/goals/review` - Approve/reject goal verification

### Groups

- `GET /api/groups` - List user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Fetch group details
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/join` - Join group via invite code
- `POST /api/groups/:id/leave` - Leave group
- `GET /api/groups/:id/invite` - Get group invite link
- `GET /api/groups/:id/invite/verify` - Verify invite code

### Payments

- `POST /api/payments/setup-intent` - Create Stripe setup intent
- `GET /api/payments/method` - Get user's payment methods

### Files

- `POST /api/files/upload` - Upload files to R2 storage
- `GET /api/files/:key` - Serve files from R2 storage

## Scripts

### Development

```bash
pnpm dev              # Start local development server
pnpm dev:preview      # Start development server with preview environment
pnpm start            # Alias for pnpm dev
```

### Database Management

```bash
# Schema and migrations
pnpm db:generate      # Generate migration files from schema changes
pnpm db:push          # Push schema changes directly (development only)
pnpm db:studio        # Open Drizzle Studio for database inspection

# Local database operations
pnpm db:migrate       # Apply migrations to local database
pnpm db:seed          # Seed local database with test data
pnpm db:reset         # Reset and rebuild local database

# Preview environment operations
pnpm db:migrate:preview    # Apply migrations to preview database
pnpm db:seed:preview      # Seed preview database with test data
pnpm db:reset:preview     # Reset and rebuild preview database

# Production operations
pnpm db:migrate:production # Apply migrations to production database
```

### Testing and Quality

```bash
pnpm test             # Run test suite with Vitest
pnpm lint             # Check code formatting and linting
pnpm format           # Auto-format code with Prettier
```

### Deployment

```bash
pnpm deploy:preview     # Deploy to preview environment
pnpm deploy:production  # Deploy to production environment
```

### Utilities

```bash
pnpm cf-typegen       # Generate Cloudflare Workers types
```

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
    │  │  ├─ users*.ts      # User management endpoints
    │  │  ├─ goals*.ts      # Goal management and verification
    │  │  ├─ groups*.ts     # Group management and invites
    │  │  ├─ payments*.ts   # Stripe payment integration
    │  │  └─ files*.ts      # File upload and serving
    │  ├─ db/
    │  │  └─ schema.ts      # Drizzle database schema
    │  ├─ scheduler/        # Cron job handlers
    │  │  └─ settlement.ts  # Automated settlement processing
    │  ├─ services/         # Business logic services
    │  ├─ lib/              # Utility functions
    │  ├─ auth.ts           # Better Auth configuration
    │  ├─ index.ts          # Main application entry point
    │  ├─ types.ts          # TypeScript type definitions
    │  └─ env.d.ts          # Environment type definitions
    ├─ drizzle/             # Database migrations
    │  ├─ 0000_init.sql
    │  └─ meta/
    ├─ drizzle-seed/        # Database seeding scripts
    │  ├─ seed-dev-preview.sql
    │  └─ reset-db.sql
    ├─ wrangler.jsonc       # Cloudflare Workers configuration
    ├─ drizzle.config.ts    # Drizzle ORM configuration
    ├─ vitest.config.ts     # Test configuration
    ├─ package.json
    └─ tsconfig.json
