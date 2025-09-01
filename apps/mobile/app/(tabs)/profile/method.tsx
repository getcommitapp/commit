import { View } from "react-native";
import { spacing, useThemeColor } from "@/components/Themed";
import { Button } from "@/components/ui/Button";
import { CardField } from "@stripe/stripe-react-native";
import { useSavePaymentMethod } from "@/lib/hooks/useSavePaymentMethod";
import { router } from "expo-router";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

export default function PaymentMethodScreen() {
  const cardColor = useThemeColor({}, "card");
  const { mutateAsync, isPending } = useSavePaymentMethod();

  async function handleSaveCard() {
    await mutateAsync();
    router.dismissAll();
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
        disabled={isPending}
        loading={isPending}
        title="Update card"
        size="lg"
      />
    </ScreenLayout>
  );
}
