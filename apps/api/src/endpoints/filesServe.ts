import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../types";

export class FilesServe extends OpenAPIRoute {
  schema = {
    tags: ["Files"],
    summary: "Serve a file stored in R2",
    request: {},
    responses: {
      "200": { description: "The file contents" },
      "404": { description: "Not found" },
    },
  } as const;

  async handle(c: AppContext) {
    const { key } = c.req.param();
    const bucket = c.env.R2;
    const obj = await bucket.get(key);
    if (!obj) return new Response("Not Found", { status: 404 });
    const headers = new Headers();
    const type = obj.httpMetadata?.contentType || "application/octet-stream";
    headers.set("Content-Type", type);
    return new Response(obj.body, { headers });
  }
}
