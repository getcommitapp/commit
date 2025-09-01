import { View } from "react-native";

import { FormGroup, FormItem } from "@/components/ui/form";
import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePaymentMethod } from "@/lib/hooks/usePaymentMethod";
import { capitalize } from "@/lib/utils";

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const { user, refetch } = useAuth();
  const { data: payment } = usePaymentMethod();

  return (
    <ScreenLayout largeTitle onRefresh={refetch}>
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
              {payment?.status === "active" ? (
                <Ionicons name="checkmark-circle" size={18} color={success} />
              ) : (
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={mutedForeground}
                />
              )}
              <ThemedText
                style={{
                  ...textVariants.bodyEmphasized,
                  color:
                    payment?.status === "active" ? success : mutedForeground,
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
