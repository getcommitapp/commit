import { z } from "zod";

export const FilesUploadResponseSchema = z.object({
  url: z.string(),
  key: z.string(),
});
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;
