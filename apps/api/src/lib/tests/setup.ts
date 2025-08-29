import { env } from "cloudflare:test";
import { beforeEach, vi } from "vitest";

// Mock auth globally for all tests
vi.hoisted(() => {
  vi.resetModules();
});
vi.mock("../../auth", () => {
  return {
    createAuth: (env: Env) => ({
      handler: async (_req: Request) => new Response("OK", { status: 200 }),
      api: {
        getSession: async (_opts: { headers: Headers }) => {
          // Query current user role from DB so tests reflect updates
          const result = await env.DB.prepare(
            "SELECT role FROM user WHERE id = ? LIMIT 1"
          )
            .bind("user_1")
            .first<{ role: string }>();
          return {
            user: { id: "user_1", role: result?.role ?? "user" },
            session: { id: "session_1" },
          };
        },
      },
    }),
  };
});

// Mock Stripe globally for API tests
vi.mock("stripe", () => {
  return {
    default: class Stripe {
      customers = {
        create: vi
          .fn()
          .mockResolvedValue({ id: "cus_123", invoice_settings: {} }),
        retrieve: vi
          .fn()
          .mockResolvedValue({ id: "cus_123", invoice_settings: {} }),
        createBalanceTransaction: vi
          .fn()
          .mockResolvedValue({ id: "cbt_123", amount: -500, currency: "chf" }),
      };
      setupIntents = {
        create: vi.fn().mockResolvedValue({ client_secret: "seti_secret_123" }),
      };
      paymentIntents = {
        create: vi
          .fn()
          .mockResolvedValue({ id: "pi_123", status: "succeeded" }),
        retrieve: vi.fn().mockResolvedValue({ id: "pi_123" }),
      };
      paymentMethods = {
        list: vi.fn().mockResolvedValue({ data: [] }),
        retrieve: vi.fn().mockResolvedValue({
          id: "pm_123",
          card: {
            brand: "visa",
            last4: "4242",
            exp_month: 12,
            exp_year: 2030,
          },
        }),
      };
      refunds = {
        create: vi
          .fn()
          .mockResolvedValue({ id: "re_123", status: "succeeded" }),
      };
      constructor(_key: string) {}
    },
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
    "INSERT INTO user (id, name, email, emailVerified, image, updatedAt, role) VALUES ('user_1','Test User','test@example.com',1,NULL,strftime('%s','now'),'user');";

  await env.DB.exec(`${deleteStatements}\n${seedUserStatement}`);
}

beforeEach(async () => {
  await resetDb();
});
