import { OpenAPIRoute } from "chanfana";
import { GroupInviteGetResponseSchema } from "@commit/types";

export class GroupInvite extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Create an invite link for a group",
    responses: {
      "200": {
        description: "Invite link created successfully",
        content: {
          "application/json": {
            schema: GroupInviteGetResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
