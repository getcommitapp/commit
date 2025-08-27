import { env } from "cloudflare:test";
import { beforeEach, vi } from "vitest";

// Mock auth globally for all tests
vi.hoisted(() => {
  vi.resetModules();
});
vi.mock("../../auth", () => {
  return {
    createAuth: (_env: Env) => ({
      handler: async (_req: Request) => new Response("OK", { status: 200 }),
      api: {
        getSession: async (_opts: { headers: Headers }) => ({
          user: { id: "user_1" },
          session: { id: "session_1" },
        }),
      },
    }),
  };
});

async function resetDb() {
  // Truncate data in dependency-safe order (children before parents)
  const tablesInDeleteOrder = [
    "goal_verifications_log",
    "goal_verifications_method",
    "group_participants",
    "group",
    "account",
    "session",
    "verification",
    "goal",
    "charity",
    "user",
  ];

  const deleteStatements = tablesInDeleteOrder
    .map((tableName) => `DELETE FROM \`${tableName}\`;`)
    .join("\n");

  const seedUserStatement =
    "INSERT INTO user (id, name, email, emailVerified, image, updated_at) VALUES ('user_1','Test User','test@example.com',1,NULL,strftime('%s','now'));";

  await env.DB.exec(`${deleteStatements}\n${seedUserStatement}`);
}

beforeEach(async () => {
  await resetDb();
});
