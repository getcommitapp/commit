import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { UserDeleteResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class UsersDelete extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Delete a user",
    responses: {
      "200": {
        description: "Returns if the user was deleted successfully",
        content: {
          "application/json": {
            schema: UserDeleteResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user;

    const db = drizzle(c.env.DB, { schema });

    await db.delete(schema.User).where(eq(schema.User.id, user.id));

    return c.json({ message: "User deleted successfully." });
  }
}
