import { OpenAPIRoute } from "chanfana";
import { type AppContext } from "../types";
import {
  UserUpdateRequestSchema,
  UserUpdateResponseSchema,
} from "@commit/types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class UserUpdate extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Update a user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: UserUpdateRequestSchema,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the updated user",
        content: {
          "application/json": {
            schema: UserUpdateResponseSchema,
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

    const data = await this.getValidatedData<typeof this.schema>();
    const { name } = data.body;

    const db = drizzle(c.env.DB, { schema });
    const now = new Date();

    await db
      .update(schema.User)
      .set({ name, updatedAt: now })
      .where(eq(schema.User.id, current.id));

    const [updated] = await db
      .select()
      .from(schema.User)
      .where(eq(schema.User.id, current.id))
      .limit(1);

    if (!updated) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(updated);
  }
}
