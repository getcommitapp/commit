import { authClient } from "./auth-client";
import { z } from "zod";
import { config } from "../config";

// Overloads to return schema-inferred types when a schema is provided
export async function apiFetch(
  input: string,
  init?: RequestInit
): Promise<unknown>;
export async function apiFetch<S extends z.ZodTypeAny>(
  input: string,
  init: RequestInit | undefined,
  schema: S
): Promise<z.infer<S>>;
export async function apiFetch(
  input: string,
  init: RequestInit = {},
  schema?: z.ZodTypeAny
) {
  const headers = new Headers(init.headers);

  // Dev/preview: signal API to impersonate a seeded test user by email
  // Set EXPO_PUBLIC_DEV_AUTO_AUTH_AS_TEST_USER to e.g. "user@commit.local" or "reviewer@commit.local"
  if (config.devAutoAuthAsTestUser) {
    headers.set("X-Commit-Dev-Auto-Auth", config.devAutoAuthAsTestUser);
  }

  // Real session (if any)
  const session = await authClient.getSession();
  if (session?.data?.session?.token) {
    headers.set("Authorization", `Bearer ${session.data.session.token}`);
  }

  headers.set("Content-Type", "application/json");

  const url = `${process.env.EXPO_PUBLIC_API_URL}/api${input}`;

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  const json = await res.json();
  return schema ? schema.parse(json) : json;
}

export type ApiSuccess<T> = { success: true } & T;
