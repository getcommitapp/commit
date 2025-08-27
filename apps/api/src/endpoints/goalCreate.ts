import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import {
  GoalCreateRequestSchema,
  GoalCreateResponseSchema,
} from "@commit/types";

export class GoalCreate extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Create a new Goal",
    request: {
      body: {
        content: {
          "application/json": {
            schema: GoalCreateRequestSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the created goal",
        content: {
          "application/json": {
            schema: GoalCreateResponseSchema,
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
