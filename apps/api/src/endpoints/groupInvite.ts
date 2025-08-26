import { OpenAPIRoute } from "chanfana";

export class GroupInvite extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Create an invite link for a group",
    responses: {
      "200": {
        description: "Invite link created successfully",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
