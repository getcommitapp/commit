import { applyD1Migrations, env } from "cloudflare:test";

// Apply any pending migrations once before running tests
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
