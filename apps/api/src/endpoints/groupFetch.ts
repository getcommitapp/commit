import { OpenAPIRoute } from "chanfana";

export class GroupFetch extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Get a group by id",
    responses: {
      "200": {
        description: "Returns the requested group",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
