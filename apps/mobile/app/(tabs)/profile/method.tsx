import { View } from "react-native";
import { spacing, useThemeColor } from "@/components/Themed";
import { Button } from "@/components/ui/Button";
import { CardField, useConfirmSetupIntent } from "@stripe/stripe-react-native";
import { apiFetch } from "@/lib/api";
import { PaymentsSetupIntentResponseSchema } from "@commit/types";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

export default function PaymentMethodScreen() {
  const cardColor = useThemeColor({}, "card");
  const { confirmSetupIntent, loading } = useConfirmSetupIntent();

  async function handleSaveCard() {
    // 1) Create SetupIntent on API
    const { clientSecret } = await apiFetch(
      "/payments/setup-intent",
      { method: "POST" },
      PaymentsSetupIntentResponseSchema
    );

    // 2) Confirm on device with card details from CardField
    const { error } = await confirmSetupIntent(clientSecret, {
      paymentMethodType: "Card",
    });
    if (error) {
      throw new Error(error.message);
    }
  }

  return (
    <ScreenLayout
      style={{ flexGrow: 1 }}
      fullscreen
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ marginTop: spacing.md }}>
        <CardField
          cardStyle={{
            textColor: "#000000",
            backgroundColor: cardColor,
          }}
          style={{
            width: "100%",
            height: 50,
          }}
          autofocus
          postalCodeEnabled={false}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Button
        onPress={handleSaveCard}
        disabled={loading}
        loading={loading}
        title="Update card"
        size="lg"
      />
    </ScreenLayout>
  );
}
