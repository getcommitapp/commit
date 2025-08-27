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

  async handle(c: AppContext) {
    const _user = c.var.user;

    await this.getValidatedData<typeof this.schema>();

    // Placeholder for future Stripe account/link creation
    return c.json({ success: true });
  }
}
