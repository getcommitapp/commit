/// <reference types="@cloudflare/vitest-pool-workers" />
/// <reference path="./worker-configuration.d.ts" />

declare interface Env {
  DB: D1Database;
  AUTH_GOOGLE_CLIENT_ID: string;
  AUTH_GOOGLE_CLIENT_SECRET: string;
  AUTH_APPLE_CLIENT_ID: string;
  AUTH_APPLE_CLIENT_SECRET?: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    DB: D1Database;
    TEST_MIGRATIONS: D1Migration[];
  }
}
