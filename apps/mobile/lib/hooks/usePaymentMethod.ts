import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { PaymentsMethodResponseSchema } from "@commit/types";

export function usePaymentMethod() {
  return useQuery({
    queryKey: ["payments", "method"],
    queryFn: async () => {
      return await apiFetch(
        "/payments/method",
        { method: "GET" },
        PaymentsMethodResponseSchema
      );
    },
  });
}
