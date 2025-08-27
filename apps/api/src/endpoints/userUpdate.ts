import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import {
  UserUpdateRequestSchema,
  UserUpdateResponseSchema,
} from "@commit/types";

export class UserUpdate extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Update a user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: UserUpdateRequestSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the updated user",
        content: {
          "application/json": {
            schema: UserUpdateResponseSchema,
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
