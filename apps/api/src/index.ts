import { fromHono } from "chanfana";
import { Hono } from "hono";
import { createAuth } from "./auth";
import { cors } from "hono/cors";

// Profile
import { ProfileFetch } from "./endpoints/profileFetch";
import { ProfileUpdate } from "./endpoints/profileUpdate";
import { ProfileStripeCreate } from "./endpoints/profileStripeCreate";
import { ProfileDelete } from "./endpoints/profileDelete";
// Stripe
import { StripeSetupIntent } from "./endpoints/stripeSetupIntent";

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
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// -------------------- Register OpenAPI endpoints --------------------

// Profile (prefixed with /api)
openapi.get("/api/profile", ProfileFetch);
openapi.put("/api/profile", ProfileUpdate);
openapi.post("/api/profile", ProfileStripeCreate);
openapi.delete("/api/profile", ProfileDelete);

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

// Stripe (Payment method setup)
openapi.post("/api/stripe/setup-intent", StripeSetupIntent);

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
