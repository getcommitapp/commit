import { OpenAPIRoute } from "chanfana";

export class GroupInviteVerify extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Verify a group invite",
    responses: {
      "200": {
        description: "Invite verified successfully",
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
