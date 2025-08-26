import { authClient } from "./auth-client";
import { z } from "zod";

export async function apiFetch<T = unknown>(
  input: string,
  init: RequestInit = {},
  schema?: z.ZodType<T>
) {
  const session = await authClient.getSession();
  const headers = new Headers(init.headers);
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
