import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { createAuth } from "./auth";
import { cors } from "hono/cors";

// Profile
import { ProfileFetch } from "./endpoints/profile/profileFetch";
import { ProfileUpdate } from "./endpoints/profile/profileUpdate";
import { ProfileStripeCreate } from "./endpoints/profile/profileStripeCreate";
import { ProfileDelete } from "./endpoints/profile/profileDelete";

// Goals
import { GoalsList } from "./endpoints/goals/goalsList";
import { GoalCreate } from "./endpoints/goals/goalCreate";
import { GoalFetch } from "./endpoints/goals/goalFetch";
import { GoalDelete } from "./endpoints/goals/goalDelete";
import { GoalVerify } from "./endpoints/goals/goalVerify";

// Groups
import { GroupsList } from "./endpoints/groups/groupsList";
import { GroupCreate } from "./endpoints/groups/groupCreate";
import { GroupFetch } from "./endpoints/groups/groupFetch";
import { GroupInvite } from "./endpoints/groups/groupInvite";
import { GroupInviteVerify } from "./endpoints/groups/groupInviteVerify";
import { GroupGoal } from "./endpoints/groups/groupGoal";
import { GroupLeave } from "./endpoints/groups/groupLeave";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// -------------------- Register OpenAPI endpoints --------------------

// Profile
openapi.get("/profile", ProfileFetch);
openapi.put("/profile", ProfileUpdate);
openapi.post("/profile", ProfileStripeCreate);
openapi.delete("/profile", ProfileDelete);

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
