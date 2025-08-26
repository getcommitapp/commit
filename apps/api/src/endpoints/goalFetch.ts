import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class GoalFetch extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Get a single Goal by id",
    responses: {
      "200": {
        description: "Returns a single goal if found",
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
