import app from "../index";
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { GroupSummary } from "@commit/types";

describe("GET /api/groups (list)", () => {
  it("returns empty list initially", async () => {
    const res = await app.request("/api/groups", {}, env);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });

  it("lists groups after creating some", async () => {
    const create = async (name: string) =>
      app.request(
        "/api/groups",
        {
          method: "POST",
          body: JSON.stringify({ name, description: null }),
          headers: new Headers({ "Content-Type": "application/json" }),
        },
        env
      );

    await create("A");
    await create("B");

    const res = await app.request("/api/groups", {}, env);
    expect(res.status).toBe(200);
    const items: GroupSummary[] = await res.json();
    expect(items.length).toBe(2);
    expect(items.map((g) => g.name).sort()).toEqual(["A", "B"]);
  });
});
