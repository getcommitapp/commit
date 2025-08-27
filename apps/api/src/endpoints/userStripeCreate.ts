import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import {
  UserStripeCreateRequestSchema,
  UserStripeCreateResponseSchema,
} from "@commit/types";

export class UserStripeCreate extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Create a new Stripe connection",
    request: {
      body: {
        content: {
          "application/json": {
            schema: UserStripeCreateRequestSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the Stripe connection",
        content: {
          "application/json": {
            schema: UserStripeCreateResponseSchema,
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
