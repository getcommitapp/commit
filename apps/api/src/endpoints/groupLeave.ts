import { OpenAPIRoute } from "chanfana";
import { GroupLeaveResponseSchema } from "@commit/types";

export class GroupLeave extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Leave a group",
    responses: {
      "200": {
        description: "Left group successfully",
        content: {
          "application/json": {
            schema: GroupLeaveResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
