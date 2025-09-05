import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class FilesServe extends OpenAPIRoute {
  schema = {
    tags: ["Files"],
    summary: "Serve a file stored in R2",
    parameters: [
      {
        name: "key",
        in: "path" as const,
        required: true,
        schema: {
          type: "string" as const,
        },
        description: "File key",
      },
    ],
    responses: {
      "200": { description: "The file contents" },
      "403": { description: "Forbidden - reviewer access required" },
      "404": { description: "Not found" },
    },
  };

  async handle(c: AppContext) {
    const user = c.var.user;
    if (!user || user.role !== "reviewer") {
      return c.json({ error: "Forbidden" }, 403);
    }
    const { key } = c.req.param();
    const decodedKey = decodeURIComponent(key);
    const bucket = c.env.R2;
    const obj = await bucket.get(decodedKey);
    if (!obj) return new Response("Not Found", { status: 404 });
    const headers = new Headers();
    const type = obj.httpMetadata?.contentType || "application/octet-stream";
    headers.set("Content-Type", type);
    return new Response(obj.body, { headers });
  }
}
