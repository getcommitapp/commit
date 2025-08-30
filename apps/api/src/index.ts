import { fromHono } from "chanfana";
import { Hono } from "hono";
import { createAuth } from "./auth";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

// User
import { UsersFetch } from "./endpoints/usersFetch";
import { UsersUpdate } from "./endpoints/usersUpdate";
import { UsersDelete } from "./endpoints/usersDelete";

// Goals
import { GoalsList } from "./endpoints/goalsList";
import { GoalsCreate } from "./endpoints/goalsCreate";
import { GoalsDelete } from "./endpoints/goalsDelete";
import { GoalsVerify } from "./endpoints/goalsVerify";
import { GoalsTimerGet } from "./endpoints/goalsTimerGet";
import { GoalsTimerStart } from "./endpoints/goalsTimerStart";
import { GoalsReviewList } from "./endpoints/goalsReviewList";
import { GoalsReviewUpdate } from "./endpoints/goalsReviewUpdate";
import { GoalsFetch } from "./endpoints/goalsFetch";

// Groups
import { GroupsList } from "./endpoints/groupsList";
import { GroupsCreate } from "./endpoints/groupsCreate";
import { GroupsInvite } from "./endpoints/groupsInvite";
import { GroupsInviteVerify } from "./endpoints/groupsInviteVerify";
import { GroupsLeave } from "./endpoints/groupsLeave";
import { GroupsDelete } from "./endpoints/groupsDelete";
import { GroupsFetch } from "./endpoints/groupsFetch";
import { HonoContext } from "./types";
import { GroupsJoin } from "./endpoints/groupsJoin";

// Payments
import { PaymentsSetupIntent } from "./endpoints/paymentsSetupIntent";
import { PaymentsCharge as PaymentsDebit } from "./endpoints/paymentsDebit";
import { PaymentsRefund } from "./endpoints/paymentsRefund";
import { PaymentsCredit } from "./endpoints/paymentsCredit";
import { PaymentsMethod } from "./endpoints/paymentsMethod";

// Start a Hono app
const app = new Hono<HonoContext>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// CORS for auth routes (adjust origin as needed)
app.use(
  "/api/auth/*",
  cors({
    origin: (origin) => origin || "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// CORS for payments routes
app.use(
  "/api/payments/*",
  cors({
    origin: (origin) => origin || "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Mount Better Auth handler (per-request to access env bindings)
app.on(["POST", "GET"], "/api/auth/*", (c) =>
  createAuth(c.env).handler(c.req.raw)
);

// Protect all routes
app.use("*", async (c, next) => {
  // Allow dev login endpoint without auth in dev/preview
  const env = c.env;
  const environment = env["ENVIRONMENT"] || "production";
  const devAutoAuthEmail = c.req.header("X-Commit-Dev-Auto-Auth"); // e.g. "user@commit.local" or "reviewer@commit.local"

  // Dev/preview override: trust custom header to impersonate a seeded user by email
  if (
    (environment === "development" || environment === "preview") &&
    devAutoAuthEmail
  ) {
    const db = drizzle(c.env.DB, { schema });
    // Load user
    const [user] = await db
      .select()
      .from(schema.User)
      .where(eq(schema.User.email, devAutoAuthEmail))
      .limit(1);
    if (!user) {
      return c.json({ error: "Dev user not found" }, 401);
    }

    // Load pre-seeded session (fixed token) for the user
    const [session] = await db
      .select()
      .from(schema.Session)
      .where(eq(schema.Session.userId, user.id))
      .limit(1);
    if (!session) {
      return c.json({ error: "Dev session not found" }, 401);
    }

    c.set("user", {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      stripeCustomerId: user.stripeCustomerId,
      emailVerified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    c.set("session", session);
    return next();
  }

  // Default: use Better Auth
  const session = await createAuth(c.env).api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  return next();
});

// User
openapi.get("/api/users", UsersFetch);
openapi.put("/api/users", UsersUpdate);
openapi.delete("/api/users", UsersDelete);

// Goals
openapi.get("/api/goals", GoalsList);
openapi.post("/api/goals", GoalsCreate);
openapi.get("/api/goals/review", GoalsReviewList);
openapi.get("/api/goals/:id", GoalsFetch);
openapi.delete("/api/goals/:id", GoalsDelete);
openapi.post("/api/goals/:id/verify", GoalsVerify);
openapi.get("/api/goals/:id/timer", GoalsTimerGet);
openapi.post("/api/goals/:id/timer/start", GoalsTimerStart);
openapi.put("/api/goals/:id/review", GoalsReviewUpdate);

// Groups
openapi.get("/api/groups", GroupsList);
openapi.post("/api/groups", GroupsCreate);
openapi.post("/api/groups/join", GroupsJoin);
openapi.get("/api/groups/:id", GroupsFetch);
openapi.delete("/api/groups/:id", GroupsDelete);
openapi.post("/api/groups/:id/leave", GroupsLeave);
openapi.get("/api/groups/:id/invite", GroupsInvite);
openapi.get("/api/groups/:id/invite/verify", GroupsInviteVerify);

// Payments
openapi.post("/api/payments/setup-intent", PaymentsSetupIntent);
openapi.post("/api/payments/debit", PaymentsDebit);
openapi.post("/api/payments/credit", PaymentsCredit);
openapi.post("/api/payments/refund", PaymentsRefund);
openapi.get("/api/payments/method", PaymentsMethod);

export default app;
