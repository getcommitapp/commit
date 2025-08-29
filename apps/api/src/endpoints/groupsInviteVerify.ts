import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import {
  GroupInviteVerifyRequestQuerySchema,
  GroupInviteVerifyResponseSchema,
} from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Group } from "../db/schema";

export class GroupsInviteVerify extends OpenAPIRoute {
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

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();

    const { code } = data.query;
    const db = drizzle(c.env.DB);
    const g = await db
      .select({ id: Group.id })
      .from(Group)
      .where(eq(Group.inviteCode, code))
      .get();
    return c.json({ valid: !!g });
  }
}
