import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { UserGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class UserFetch extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Get a single user by id",
    responses: {
      "200": {
        description: "Returns a single user if found",
        content: {
          "application/json": {
            schema: UserGetResponseSchema,
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const current = c.var.user;
    if (!current) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB, { schema });
    const [row] = await db.select().from(schema.User).where(eq(schema.User.id, current.id)).limit(1);

    if (!row) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(row);
  }
}
