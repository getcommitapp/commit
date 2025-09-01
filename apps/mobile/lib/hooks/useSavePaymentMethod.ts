import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api";
import { PaymentsSetupIntentResponseSchema } from "@commit/types";
import { useConfirmSetupIntent } from "@stripe/stripe-react-native";

export function useSavePaymentMethod() {
  const queryClient = useQueryClient();
  const { confirmSetupIntent } = useConfirmSetupIntent();

  return useMutation({
    mutationFn: async () => {
      const { clientSecret } = await apiFetch(
        "/payments/setup-intent",
        { method: "POST" },
        PaymentsSetupIntentResponseSchema
      );

      const { error } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: "Card",
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["payments", "method"] });
    },
  });
}
