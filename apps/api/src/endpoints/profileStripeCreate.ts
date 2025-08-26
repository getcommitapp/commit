import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";

export class ProfileStripeCreate extends OpenAPIRoute {
  schema = {
    tags: ["Profile"],
    summary: "Create a new Stripe connection",
    responses: {
      "200": {
        description: "Returns the Stripe connection",
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
