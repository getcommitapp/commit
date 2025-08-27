import { OpenAPIRoute } from "chanfana";
import { GroupGoalGetResponseSchema } from "@commit/types";

export class GroupGoal extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Get the group's goal",
    responses: {
      "200": {
        description: "Returns the group's goal",
        content: {
          "application/json": {
            schema: GroupGoalGetResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
