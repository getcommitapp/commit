import { Alert, View } from "react-native";

import { FormGroup, FormItem } from "@/components/ui/form";
import {
  spacing,
  ThemedText,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import CheckCircle from "@/assets/icons/check-circle.svg";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { apiFetch } from "@/lib/api";

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");
  const { user, loading: _loading, token: _token } = useAuth();

  return (
    <ScreenLayout largeTitle>
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
                Active
              </ThemedText>
            </View>
          }
        />
        <FormItem
          label="Method"
          value="TWINT"
          navigateTo="/(tabs)/profile/method"
          testID="row-payment-method"
        />
        <FormItem
          label="Test debit 10 CHF"
          onPress={async () => {
            try {
              const res = await apiFetch<{ id: string; status: string }>(
                "/payments/test/debit",
                { method: "POST" }
              );
              Alert.alert("Debit", `Status: ${res.status} (id: ${res.id})`);
            } catch (e: any) {
              Alert.alert("Debit failed", e?.message ?? String(e));
            }
          }}
          testID="row-test-debit"
        />
        <FormItem
          label="Test credit 10 CHF"
          onPress={async () => {
            try {
              const res = await apiFetch<{
                id: string;
                amount: number;
                currency: string;
              }>("/payments/test/credit", { method: "POST" });
              Alert.alert(
                "Credit",
                `Credited ${(Math.abs(res.amount) / 100).toFixed(2)} ${res.currency.toUpperCase()} (id: ${res.id})`
              );
            } catch (e: any) {
              Alert.alert("Credit failed", e?.message ?? String(e));
            }
          }}
          testID="row-test-credit"
        />
      </FormGroup>
    </ScreenLayout>
  );
}
