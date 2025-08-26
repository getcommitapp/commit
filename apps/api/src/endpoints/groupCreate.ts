import { OpenAPIRoute } from "chanfana";

export class GroupCreate extends OpenAPIRoute {
  // schema with minimal info per request: tags, summary, and 200 response description
  schema = {
    tags: ["Groups"],
    summary: "Create a new group",
    responses: {
      "200": {
        description: "Group created successfully",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
