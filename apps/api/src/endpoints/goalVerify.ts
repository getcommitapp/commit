import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import {
  GoalVerifyRequestSchema,
  GoalVerifyResponseSchema,
} from "@commit/types";

export class GoalVerify extends OpenAPIRoute {
  schema = {
    tags: ["Goals"],
    summary: "Verify the completion of the goal",
    request: {
      body: {
        content: {
          "application/json": {
            schema: GoalVerifyRequestSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Verification log submitted.",
        content: {
          "application/json": {
            schema: GoalVerifyResponseSchema,
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
