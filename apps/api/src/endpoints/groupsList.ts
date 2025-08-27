import { OpenAPIRoute } from "chanfana";
import { GroupsListResponseSchema } from "@commit/types";

export class GroupsList extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "List groups",
    responses: {
      "200": {
        description: "Returns a list of groups",
        content: {
          "application/json": {
            schema: GroupsListResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
