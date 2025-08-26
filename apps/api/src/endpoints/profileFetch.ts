import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class ProfileFetch extends OpenAPIRoute {
  schema = {
    tags: ["Profile"],
    summary: "Get a single Profile by id",
    responses: {
      "200": {
        description: "Returns a single profile if found",
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
