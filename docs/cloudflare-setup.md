## Cloudflare & D1 Integration Guide

This document explains how to connect the project backend to Cloudflare Workers and a Cloudflare D1 database, manage environments (local, preview, production), configure secrets (Stripe & OAuth), and run database migrations with Drizzle.

> Audience: Developers onboarding to the `commit` backend (`apps/api`).
> Stack: Cloudflare Workers (Wrangler) + Hono + D1 (SQLite) + Drizzle ORM + Better Auth + Stripe.

---

### Table of Contents
1. Terminology & Architecture
2. Prerequisites
3. Create D1 Databases (Preview & Production)
4. Configure `wrangler.jsonc`
5. Local Environment (`.dev.vars`)
6. Secrets vs Vars (Cloudflare)
7. Adding Secrets (Stripe, OAuth)
8. Drizzle ORM & Migrations
9. Deploying (Preview vs Production)
10. Using the API from Mobile (Expo)
11. Verifying Configuration
12. Common Pitfalls & Troubleshooting
13. Reference Command Cheat Sheet

---

### 1. Terminology & Architecture

| Concept | Description |
|---------|-------------|
| Worker Service | Edge runtime executing `src/index.ts` (Hono app). |
| D1 Database | Cloudflare-managed SQLite DB (one per environment). |
| Binding `DB` | The handle exposed to the Worker to access D1. |
| Preview Environment | Staging version (name: `commit-api-preview`) used for testing / mobile devices via public URL. |
| Production Environment | Live service (name: `commit-api`). |
| Secrets | Encrypted values (e.g., `STRIPE_SECRET_KEY`). Not visible after creation. |
| Vars | Non-sensitive key/value config injected at build/runtime (e.g., `ENVIRONMENT`). |

The Worker uses Drizzle to talk to D1 through the `DB` binding configured in `wrangler.jsonc`.

---

### 2. Prerequisites

Install dependencies at the repository root:

```bash
pnpm install
```

Required accounts / access:
* Cloudflare account with Workers + D1 enabled
* Stripe account (test mode sufficient)
* Google & Apple OAuth credentials (for Better Auth)
* Node.js 22+ and `pnpm`

---

### 3. Create D1 Databases (Preview & Production)

In the Cloudflare dashboard (or via CLI) create two D1 databases:

| Usage | Suggested Name | Notes |
|-------|----------------|-------|
| Preview | `commit-api-db-preview` | For staging/testing |
| Production | `commit-api-db` | Live data |

Record each database's UUID (shown in dashboard or via CLI):

```bash
npx wrangler d1 list            # Lists all D1 databases
```

You will copy these UUIDs into `wrangler.jsonc`.

---

### 4. Configure `wrangler.jsonc`

File: `apps/api/wrangler.jsonc`

Key sections:
* `name`: Production service name.
* `env.preview.name`: Preview service name.
* `d1_databases` (top-level & per-env) map binding `DB` to the D1 database name + id.
* `compatibility_flags`: Includes `nodejs_compat` to allow Node libraries.

Example excerpt (simplified):

```jsonc
{
  "name": "commit-api",
  "main": "src/index.ts",
  "d1_databases": [
    { "binding": "DB", "database_name": "commit-api-db", "database_id": "<PROD_UUID>", "migrations_dir": "drizzle" }
  ],
  "env": {
    "preview": {
      "name": "commit-api-preview",
      "d1_databases": [
        { "binding": "DB", "database_name": "commit-api-db-preview", "database_id": "<PREVIEW_UUID>", "migrations_dir": "drizzle" }
      ],
      "vars": { "ENVIRONMENT": "preview" }
    },
    "production": {
      "name": "commit-api",
      "d1_databases": [
        { "binding": "DB", "database_name": "commit-api-db", "database_id": "<PROD_UUID>", "migrations_dir": "drizzle" }
      ],
      "vars": { "ENVIRONMENT": "production" }
    }
  }
}
```

After editing, keep the file under version control **without** secrets.

---

### 5. Local Environment (`.dev.vars`)

For local `wrangler dev` runs, variables come from `.dev.vars`.

Steps:
```bash
cd apps/api
cp .dev.vars.example .dev.vars
```
Edit `.dev.vars` and fill in values (never commit real secrets):
```dotenv
AUTH_GOOGLE_CLIENT_ID=...
AUTH_GOOGLE_CLIENT_SECRET=...
AUTH_APPLE_CLIENT_ID=...
AUTH_APPLE_CLIENT_SECRET=...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

Run local dev:
```bash
pnpm dev
```
Local URL: `http://localhost:8787`

---

### 6. Secrets vs Vars (Cloudflare)

| Type | Use Case | Set With | Example |
|------|----------|----------|---------|
| Secret | Sensitive tokens/keys | `wrangler secret put` | `STRIPE_SECRET_KEY` |
| Var | Non-sensitive config | `wrangler.jsonc` (`vars`) | `ENVIRONMENT=preview` |

Access in code (TypeScript Worker): `env.STRIPE_SECRET_KEY`, `env.ENVIRONMENT`.

---

### 7. Adding Secrets (Stripe, OAuth)

From `apps/api` directory:

```bash
# Preview environment
npx wrangler secret put STRIPE_SECRET_KEY --env preview
npx wrangler secret put AUTH_GOOGLE_CLIENT_ID --env preview
npx wrangler secret put AUTH_GOOGLE_CLIENT_SECRET --env preview
npx wrangler secret put AUTH_APPLE_CLIENT_SECRET --env preview

# (Optional) Publishable key if you need it in Worker (usually only mobile needs it)
npx wrangler secret put STRIPE_PUBLISHABLE_KEY --env preview

# Production (repeat with live keys)
npx wrangler secret put STRIPE_SECRET_KEY --env production
...
```

List secrets:
```bash
npx wrangler secret list --env preview
```

Remove a secret:
```bash
npx wrangler secret delete STRIPE_SECRET_KEY --env preview
```

> You cannot read a secret’s value after storing it. Keep originals in a secure vault.

---

### 8. Drizzle ORM & Migrations

Schema lives in `src/db/schema.ts`. Migration SQL files generated into `drizzle/`.

Generate a migration after schema changes:
```bash
pnpm db:generate --name add_my_table
```

Apply migrations to preview DB:
```bash
pnpm db:migrate:preview
```

Inspect DB (Drizzle Studio):
```bash
pnpm db:studio
```

Manual (fallback) CLI apply (if needed):
```bash
npx wrangler d1 migrations apply <preview_db_name> --env preview
```

> Always apply to preview first. Once validated, apply to production before or during deployment.

---

### 9. Deploying (Preview vs Production)

Preview deployment (used by Expo Go / testers):
```bash
pnpm deploy:preview
```
Production deployment:
```bash
pnpm deploy:production
```

Common flow:
1. Commit code & push.
2. `pnpm deploy:preview`
3. Run migrations (if new): `pnpm db:migrate:preview`
4. Test endpoints (curl / mobile app).
5. Repeat for production: deploy + migrations.

---

### 10. Using the API from Mobile (Expo)

Set the mobile app env var (`apps/mobile/.env.local`):
```dotenv
EXPO_PUBLIC_API_URL=https://<preview-worker-subdomain>.workers.dev/
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Restart Expo dev server after changes.

The mobile code concatenates routes, e.g. `fetch(\`${process.env.EXPO_PUBLIC_API_URL}api/stripe/setup-intent\`)`.

---

### 11. Verifying Configuration

Check Worker is live:
```bash
curl -I https://commit-api-preview.<your-account>.workers.dev/
```

Check D1 binding works (simple health endpoint if implemented) or run a `SELECT 1` via console:
```bash
npx wrangler d1 execute commit-api-db-preview --env preview --command "SELECT 1;"
```

Check Stripe secret correctness:
```bash
curl -u sk_test_xxx: https://api.stripe.com/v1/customers -G -d limit=1
```
Expect JSON without `"error": { "code": "invalid_api_key" }`.

---

### 12. Common Pitfalls & Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `Invalid API Key provided` | Wrong or placeholder Stripe secret deployed | Re-run `wrangler secret put STRIPE_SECRET_KEY` with correct value |
| Empty list responses (e.g. payment methods) | Auth/session not resolving user | Implement proper session retrieval before querying Stripe |
| Migration not applying | Wrong DB id / environment | Verify UUIDs in `wrangler.jsonc` and re-run migrate |
| Mobile cannot reach localhost | Physical device using Expo Go | Use preview deployment URL |
| 500 error with missing binding | `DB` not defined in environment | Ensure `d1_databases` defined for that environment |

If logs needed:
```bash
npx wrangler tail --env preview
```

---

### 13. Reference Command Cheat Sheet

```bash
# Install dependencies
pnpm install

# Local dev (uses .dev.vars)
pnpm dev

# Generate & apply migrations
pnpm db:generate --name <name>
pnpm db:migrate:preview

# Deploy
pnpm deploy:preview
pnpm deploy:production

# Add secrets
npx wrangler secret put STRIPE_SECRET_KEY --env preview
npx wrangler secret list --env preview

# Tail logs
npx wrangler tail --env preview

# Execute SQL directly
npx wrangler d1 execute commit-api-db-preview --env preview --command "SELECT name FROM sqlite_master LIMIT 5;"
```

---

### Next Steps for New Contributors
1. Clone repo & install dependencies.
2. Configure `.dev.vars` with test credentials.
3. Run `pnpm dev` and confirm OpenAPI root loads.
4. Deploy preview + run migrations, point mobile app to preview URL.
5. Add real keys/secrets as needed and extend endpoints.

---

For deeper architectural context, see `docs/architecture.md`.

If anything is missing or unclear, update this document in your PR.
