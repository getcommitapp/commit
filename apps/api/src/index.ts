import { fromHono } from "chanfana";
import { Hono } from "hono";
import { createAuth } from "./auth";
import { cors } from "hono/cors";

import type { User, Session } from "better-auth";

// user
import { UserFetch } from "./endpoints/userFetch";
import { UserUpdate } from "./endpoints/userUpdate";
import { UserStripeCreate } from "./endpoints/userStripeCreate";
import { UserDelete } from "./endpoints/userDelete";

// Goals
import { GoalsList } from "./endpoints/goalsList";
import { GoalCreate } from "./endpoints/goalCreate";
import { GoalFetch } from "./endpoints/goalFetch";
import { GoalDelete } from "./endpoints/goalDelete";
import { GoalVerify } from "./endpoints/goalVerify";

// Groups
import { GroupsList } from "./endpoints/groupsList";
import { GroupCreate } from "./endpoints/groupCreate";
import { GroupFetch } from "./endpoints/groupFetch";
import { GroupInvite } from "./endpoints/groupInvite";
import { GroupInviteVerify } from "./endpoints/groupInviteVerify";
import { GroupGoal } from "./endpoints/groupGoal";
import { GroupLeave } from "./endpoints/groupLeave";

// Start a Hono app
const app = new Hono<{
  Bindings: Env;
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// -------------------- Middleware Sections --------------------

// Add authMiddleware
app.use("*", async (c, next) => {
  const session = await createAuth(c.env).api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);

  return next();
});

// -------------------- Register OpenAPI endpoints --------------------

// User
openapi.get("/user", UserFetch);
openapi.put("/user", UserUpdate);
openapi.post("/user", UserStripeCreate);
openapi.delete("/user", UserDelete);

// Goals
openapi.get("/goals", GoalsList);
openapi.post("/goals", GoalCreate);
openapi.get("/goals/:id", GoalFetch);
openapi.delete("/goals/:id", GoalDelete);
openapi.post("/goals/:id/verify", GoalVerify);

// Groups
openapi.get("/groups", GroupsList);
openapi.post("/groups", GroupCreate);
openapi.get("/groups/:id", GroupFetch);
openapi.get("/groups/:id/goal", GroupGoal);
openapi.get("/groups/:id/invite", GroupInvite);
openapi.get("/groups/:id/invite/verify", GroupInviteVerify);
openapi.post("/groups/:id/leave", GroupLeave);

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

// Mount Better Auth handler (per-request to access env bindings)
app.on(["POST", "GET"], "/api/auth/*", (c) =>
  createAuth(c.env).handler(c.req.raw)
);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
