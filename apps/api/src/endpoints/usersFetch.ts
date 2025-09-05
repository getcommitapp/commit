import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { UserGetResponseSchema } from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class UsersFetch extends OpenAPIRoute {
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
      "404": { description: "User not found" },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;

    const db = drizzle(c.env.DB, { schema });
    const [row] = await db
      .select()
      .from(schema.User)
      .where(eq(schema.User.id, user.id))
      .limit(1);

    if (!row) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(row);
  }
}
