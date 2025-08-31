import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";
import { FilesUploadResponseSchema } from "@commit/types";

export class FilesUpload extends OpenAPIRoute {
  schema = {
    tags: ["Files"],
    summary: "Upload a file to R2 and return a URL",
    request: {},
    responses: {
      "200": {
        description: "Upload result",
        content: {
          "application/json": {
            schema: FilesUploadResponseSchema,
          },
        },
      },
      "400": { description: "Invalid request" },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user!;
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const contentType = c.req.header("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return c.json({ error: "Expected multipart/form-data" }, 400);
    }

    const form = await c.req.parseBody();
    const file = form["file"] as File | undefined;
    if (!file) return c.json({ error: "file is required" }, 400);

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const date = new Date();
    const key = `users/${user.id}/${date.getUTCFullYear()}/${(
      date.getUTCMonth() + 1
    )
      .toString()
      .padStart(
        2,
        "0"
      )}/${date.getUTCDate().toString().padStart(2, "0")}/${crypto
      .randomUUID()
      .replace(/-/g, "")}.${ext}`;

    const bucket = c.env.R2;
    const put = await bucket.put(key, bytes, {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
    if (!put) return c.json({ error: "Failed to store file" }, 500);

    const url = `/api/files/${encodeURIComponent(key)}`;
    return c.json({ url, key });
  }
}
