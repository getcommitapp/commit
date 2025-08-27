import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { UserDeleteResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class UserDelete extends OpenAPIRoute {
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

    // Attempt deletion (will fail with FK constraint if referenced elsewhere)
    try {
      await db.delete(schema.User).where(eq(schema.User.id, user.id));
    } catch (_e) {
      // For now, surface a controlled error (could implement soft-delete later)
      return c.json({
        message:
          "Cannot delete user account as it has associated data. Please contact support for assistance.",
      });
    }

    return c.json({ message: "User deleted successfully." });
  }
}
