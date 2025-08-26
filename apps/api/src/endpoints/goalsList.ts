import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class GoalsList extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "List Goals",
    responses: {
      "200": {
        description: "Returns a list of goals",
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
