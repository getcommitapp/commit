import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../api";

type UploadResponse = { url: string; key: string };

export function useUploadFile() {
  return useMutation({
    mutationFn: async (params: {
      uri: string;
      name?: string;
      type?: string;
    }) => {
      const form = new FormData();
      const file: any = {
        uri: params.uri,
        name: params.name ?? `photo.jpg`,
        type: params.type ?? "image/jpeg",
      };
      form.append("file", file as unknown as Blob);
      const res = await apiFetch("/files/upload", {
        method: "POST",
        body: form,
      });
      return res as UploadResponse;
    },
  });
}
