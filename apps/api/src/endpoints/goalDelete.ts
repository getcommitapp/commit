import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { GoalDeleteResponseSchema } from "@commit/types";

export class GoalDelete extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Delete a Goal",
    responses: {
      "200": {
        description: "Returns if the goal was deleted successfully",
        content: {
          "application/json": {
            schema: GoalDeleteResponseSchema,
          },
        },
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
