import { authClient } from "./auth-client";
import { z } from "zod";
import { config } from "../config";

export async function apiFetch<T = unknown>(
  input: string,
  init: RequestInit = {},
  schema?: z.ZodType<T>
) {
  const headers = new Headers(init.headers);

  // Dev/preview: signal API to impersonate the seeded test user
  if (config.devAutoAuthAsTestUser) {
    headers.set("X-Commit-Dev-Auto-Auth", "test@commit.local");
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
  return (schema ? schema.parse(json) : json) as T;
}

export type ApiSuccess<T> = { success: true } & T;
