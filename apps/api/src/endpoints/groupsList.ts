import { OpenAPIRoute } from "chanfana";

export class GroupsList extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "List groups",
    responses: {
      "200": {
        description: "Returns a list of groups",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
