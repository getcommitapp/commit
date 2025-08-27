import { OpenAPIRoute } from "chanfana";
import {
  GroupInviteVerifyRequestQuerySchema,
  GroupInviteVerifyResponseSchema,
} from "@commit/types";

export class GroupInviteVerify extends OpenAPIRoute {
  schema = {
    tags: ["Groups"],
    summary: "Verify a group invite",
    request: {
      query: GroupInviteVerifyRequestQuerySchema,
    },
    responses: {
      "200": {
        description: "Invite verified successfully",
        content: {
          "application/json": {
            schema: GroupInviteVerifyResponseSchema,
          },
        },
      },
    },
  };

  async handle() {
    return { success: true };
  }
}
