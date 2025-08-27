import { OpenAPIRoute } from "chanfana";
import { GroupGetResponseSchema } from "@commit/types";

export class GroupFetch extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Get a group by id",
    responses: {
      "200": {
        description: "Returns the requested group",
        content: {
          "application/json": {
            schema: GroupGetResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
