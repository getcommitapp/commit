import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText, spacing, textVariants } from "@/components/Themed";
import { Button } from "@/components/ui/Button";
import { CardField, useConfirmSetupIntent } from "@stripe/stripe-react-native";
import { apiFetch } from "@/lib/api";
import { PaymentsSetupIntentResponseSchema } from "@commit/types";

export default function PaymentMethodScreen() {
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ThemedText
          style={[textVariants.bodyEmphasized, { marginTop: spacing.md }]}
        >
          Add a credit card
        </ThemedText>
        <View style={{ marginTop: spacing.md }}>
          <CardField
            postalCodeEnabled={true}
            cardStyle={{ textColor: "#000000" }}
            style={{ width: "100%", height: 50 }}
          />
        </View>
        <View style={{ height: spacing.md }} />
        <Button
          onPress={handleSaveCard}
          disabled={loading}
          loading={loading}
          title="Save card"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
