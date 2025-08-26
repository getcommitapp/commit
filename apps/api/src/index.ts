import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { createAuth } from "./auth";
import { cors } from "hono/cors";

// Profile
import { ProfileFetch } from "./endpoints/profile/ProfileFetch";
import { ProfileUpdate } from "./endpoints/profile/ProfileUpdate";
import { ProfileStripe } from "./endpoints/profile/ProfileStripeCreate";
import { ProfileDelete } from "./endpoints/profile/ProfileDelete";

// Goals
import { GoalsList } from "./endpoints/goals/GoalsList";
import { GoalCreate } from "./endpoints/goals/GoalCreate";
import { GoalFetch } from "./endpoints/goals/GoalFetch";
import { GoalDelete } from "./endpoints/goals/GoalDelete";
import { GoalVerify } from "./endpoints/goals/GoalVerify";

// Groups
import { GroupsList } from "./endpoints/groups/GroupsList";
import { GroupCreate } from "./endpoints/groups/GroupCreate";
import { GroupFetch } from "./endpoints/groups/GroupFetch";
import { GroupInvite } from "./endpoints/groups/GroupInvite";
import { GroupInviteVerify } from "./endpoints/groups/GroupInviteVerify";
import { GroupGoal } from "./endpoints/groups/GroupGoal";
import { GroupLeave } from "./endpoints/groups/GroupLeave";

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
