import { fromHono } from "chanfana";
import { Hono } from "hono";
import { createAuth } from "./auth";
import { cors } from "hono/cors";

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
import { HonoContext } from "./types";

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

// Mount Better Auth handler (per-request to access env bindings)
app.on(["POST", "GET"], "/api/auth/*", (c) =>
  createAuth(c.env).handler(c.req.raw)
);

// Protect all routes
app.use("*", async (c, next) => {
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
openapi.get("/api/user", UserFetch);
openapi.put("/api/user", UserUpdate);
openapi.post("/api/user", UserStripeCreate);
openapi.delete("/api/user", UserDelete);

// Goals
openapi.get("/api/goals", GoalsList);
openapi.post("/api/goals", GoalCreate);
openapi.get("/api/goals/:id", GoalFetch);
openapi.delete("/api/goals/:id", GoalDelete);
openapi.post("/api/goals/:id/verify", GoalVerify);

// Groups
openapi.get("/api/groups", GroupsList);
openapi.post("/api/groups", GroupCreate);
openapi.get("/api/groups/:id", GroupFetch);
openapi.get("/api/groups/:id/goal", GroupGoal);
openapi.get("/api/groups/:id/invite", GroupInvite);
openapi.get("/api/groups/:id/invite/verify", GroupInviteVerify);
openapi.post("/api/groups/:id/leave", GroupLeave);

export default app;
