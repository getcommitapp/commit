import { StyleSheet, View, Text } from "react-native";

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
import Constants from "expo-constants";
import SwissFlag from "@/assets/icons/swiss-flag.svg";
import CommitLogo from "@/assets/icons/commit-logo-text.svg";

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");
  const mutedForeground = useThemeColor({}, "mutedForeground");
  const { user, refetch } = useAuth();
  const { data: payment } = usePaymentMethod();
  const APP_VERSION = Constants.expoConfig?.version;

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
      <View style={styles.footer}>
        <CommitLogo width={50} height={14} />
        <View style={styles.madeIn}>
          <Text
            style={{
              ...textVariants.caption1,
              color: mutedForeground,
            }}
          >
            Made with <Text style={{ color: "red" }}>♥</Text> in Switzerland
          </Text>
          <SwissFlag width={12} height={12} />
        </View>
        <Text
          style={{
            ...textVariants.caption2,
            color: mutedForeground,
          }}
        >
          v{APP_VERSION}
        </Text>

        {/* <TouchableOpacity
          onPress={() => Linking.openURL("https://commit.leo-c50.workers.dev/")}
        >
          <ThemedText
            style={[styles.footerText, { textDecorationLine: "underline" }]}
          >
            Visit our website
          </ThemedText>
        </TouchableOpacity>
         */}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  madeIn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
