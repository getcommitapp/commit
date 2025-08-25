// Centralized route path constants for navigation clarity
// Keep leading /(tabs) for tab stack paths.
export const ROUTES = {
  GOALS_INDEX: "/(tabs)/goals",
  GOALS_CREATE: "/(tabs)/goals/create",
  GOALS_CREATE_STEP2: "/(tabs)/goals/create-step2",
  GOALS_CONFIGURE: "/(tabs)/goals/configure",
  HOME_GOAL_CREATE: "/(tabs)/home/create",
  HOME_GOAL_CREATE_STEP2: "/(tabs)/home/create-step2",
  HOME_GOAL_CONFIGURE: "/(tabs)/home/configure",
  GROUPS_CREATE: "/(tabs)/groups/create",
  HOME_GROUP_CREATE: "/(tabs)/home/group-create",
};

export type RouteKey = keyof typeof ROUTES;
