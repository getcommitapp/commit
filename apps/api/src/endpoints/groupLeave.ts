import { OpenAPIRoute } from "chanfana";

export class GroupLeave extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Leave a group",
    responses: {
      "200": {
        description: "Left group successfully",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
