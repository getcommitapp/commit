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
    const user = c.var.user;

    const data = await this.getValidatedData<typeof this.schema>();
    const { name } = data.body;

    const db = drizzle(c.env.DB, { schema });
    const now = new Date();

    const updated = await db
      .update(schema.User)
      .set({ name, updatedAt: now })
      .where(eq(schema.User.id, user.id))
      .returning();

    return c.json(updated);
  }
}
