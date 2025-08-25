// Centralized route path constants for navigation clarity
// Keep leading /(tabs) for tab stack paths.
export const ROUTES = {
  GOALS_INDEX: "/(tabs)/goals",
  GOALS_CREATE: "/(tabs)/goals/create",
  GOALS_CREATE_STEP2: "/(tabs)/goals/create-step2",
  GOALS_CONFIGURE: "/(tabs)/goals/configure",
  GOALS_VERIFY: "/(tabs)/goals/verify",
  GROUPS_VERIFY: "/(tabs)/groups/verify",
  HOME_GOAL_CREATE: "/(tabs)/home/create",
  HOME_GOAL_CREATE_STEP2: "/(tabs)/home/create-step2",
  HOME_GOAL_CONFIGURE: "/(tabs)/home/configure",
  HOME_GOAL_VERIFY: "/(tabs)/home/verify",
  GROUPS_CREATE: "/(tabs)/groups/create",
  HOME_GROUP_CREATE: "/(tabs)/home/group-create",
  HOME_GROUP_VERIFY: "/(tabs)/home/group-verify",
};

export type RouteKey = keyof typeof ROUTES;
