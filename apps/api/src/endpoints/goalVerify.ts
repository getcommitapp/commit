import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class GoalVerify extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Verify the completion of the goal",
    responses: {
      "200": {
        description: "Returns if successfully completed",
      },
    },
  };

  async handle(_c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const _taskToCreate = data.body;

    // Implement your own object insertion here

    // return the new task
    return {
      success: true,
    };
  }
}
