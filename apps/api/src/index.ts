import { fromHono } from "chanfana";
import { Hono } from "hono";
import { createAuth } from "./auth";
import { cors } from "hono/cors";

// user
import { UsersFetch } from "./endpoints/usersFetch";
import { UsersUpdate } from "./endpoints/usersUpdate";
import { UsersDelete } from "./endpoints/usersDelete";

// Goals
import { GoalsList } from "./endpoints/goalsList";
import { GoalsCreate } from "./endpoints/goalsCreate";
import { GoalsFetch } from "./endpoints/goalsFetch";
import { GoalsDelete } from "./endpoints/goalsDelete";
import { GoalsVerify } from "./endpoints/goalsVerify";

// Groups
import { GroupsList } from "./endpoints/groupsList";
import { GroupsCreate } from "./endpoints/groupsCreate";
import { GroupsFetch } from "./endpoints/groupsFetch";
import { GroupsInvite } from "./endpoints/groupsInvite";
import { GroupsInviteVerify } from "./endpoints/groupsInviteVerify";
import { GroupsGoal } from "./endpoints/groupsGoal";
import { GroupsLeave } from "./endpoints/groupsLeave";
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
openapi.get("/api/users", UsersFetch);
openapi.put("/api/users", UsersUpdate);
openapi.delete("/api/users", UsersDelete);

// Goals
openapi.get("/api/goals", GoalsList);
openapi.post("/api/goals", GoalsCreate);
openapi.get("/api/goals/:id", GoalsFetch);
openapi.delete("/api/goals/:id", GoalsDelete);
openapi.post("/api/goals/:id/verify", GoalsVerify);

// Groups
openapi.get("/api/groups", GroupsList);
openapi.post("/api/groups", GroupsCreate);
openapi.get("/api/groups/:id", GroupsFetch);
openapi.get("/api/groups/:id/goal", GroupsGoal);
openapi.get("/api/groups/:id/invite", GroupsInvite);
openapi.get("/api/groups/:id/invite/verify", GroupsInviteVerify);
openapi.post("/api/groups/:id/leave", GroupsLeave);

export default app;
