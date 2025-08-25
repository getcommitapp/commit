/// <reference types="@cloudflare/workers-types" />

declare interface Env {
  DB: D1Database;
  AUTH_GOOGLE_CLIENT_ID: string;
  AUTH_GOOGLE_CLIENT_SECRET: string;
  AUTH_APPLE_CLIENT_ID: string;
  AUTH_APPLE_CLIENT_SECRET?: string;
}
