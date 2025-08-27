import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { UserGetResponseSchema } from "@commit/types";

export class UserFetch extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Get a single user by id",
    responses: {
      "200": {
        description: "Returns a single user if found",
        content: {
          "application/json": {
            schema: UserGetResponseSchema,
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
