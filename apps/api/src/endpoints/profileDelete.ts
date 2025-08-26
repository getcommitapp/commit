import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class ProfileDelete extends OpenAPIRoute {
  schema = {
    tags: ["Profile"],
    summary: "Delete a Profile",
    responses: {
      "200": {
        description: "Returns if the profile was deleted successfully",
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
