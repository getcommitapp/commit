import { OpenAPIRoute } from "chanfana";
import {
  GroupCreateRequestSchema,
  GroupCreateResponseSchema,
} from "@commit/types";

export class GroupCreate extends OpenAPIRoute {
  // schema with minimal info per request: tags, summary, and 200 response description
  schema = {
    tags: ["Groups"],
    summary: "Create a new group",
    request: {
      body: {
        content: {
          "application/json": {
            schema: GroupCreateRequestSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Group created successfully",
        content: {
          "application/json": {
            schema: GroupCreateResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
