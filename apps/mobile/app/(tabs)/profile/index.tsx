import { View } from "react-native";

import { FormGroup, FormItem } from "@/components/ui/form";
import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";
import CheckCircle from "@/assets/icons/check-circle.svg";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePaymentMethod } from "@/lib/hooks/usePaymentMethod";
import { capitalize } from "@/lib/utils";

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");
  const { user, refetch } = useAuth();
  const { data: payment } = usePaymentMethod();

  return (
    <ScreenLayout
      largeTitle
      onRefresh={async () => {
        await refetch();
      }}
    >
      <FormGroup title="Account">
        <FormItem label="Name" value={user?.name ?? "-"} />
        <FormItem label="Email" value={user?.email ?? "-"} />
      </FormGroup>

      <FormGroup title="Payment">
        <FormItem
          label="Status"
          value={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <CheckCircle width={18} height={18} color={success} />
              <ThemedText
                style={{
                  ...textVariants.bodyEmphasized,
                  color: success,
                }}
              >
                {capitalize(payment?.status ?? "inactive")}
              </ThemedText>
            </View>
          }
        />
        <FormItem
          label="Method"
          value={
            payment?.method
              ? `${payment.method.brand?.toUpperCase() ?? "CARD"} •••• ${payment.method.last4 ?? ""}`
              : "None"
          }
          navigateTo="/(tabs)/profile/method"
          testID="row-payment-method"
        />
      </FormGroup>
    </ScreenLayout>
  );
}
