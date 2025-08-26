import { OpenAPIRoute } from "chanfana";

export class GroupGoal extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Get the group's goal",
    responses: {
      "200": {
        description: "Returns the group's goal",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
