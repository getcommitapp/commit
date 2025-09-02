import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { FormGroup, FormItem } from "@/components/ui/form";
import {
  spacing,
  textVariants,
  ThemedText,
  useThemeColor,
} from "@/components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePaymentMethod } from "@/lib/hooks/usePaymentMethod";
import { capitalize } from "@/lib/utils";
import Constants from "expo-constants";
import logo from "@/assets/images/logo.png";

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
        <View style={styles.footerRow}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.footerColumn}>
            <ThemedText style={styles.version}>v{APP_VERSION}</ThemedText>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://commit.leo-c50.workers.dev/")
              }
            >
              <ThemedText
                style={[styles.footerText, { textDecorationLine: "underline" }]}
              >
                Visit our website
              </ThemedText>
            </TouchableOpacity>
            <View style={styles.madeIn}>
              <ThemedText style={styles.footerText}>
                Made in Switzerland
              </ThemedText>
              <MaterialIcons
                name="add-box"
                size={24}
                color="#D52B1E"
                style={{ marginLeft: 2, marginRight: 2 }}
              />
              <ThemedText style={styles.footerText}>with</ThemedText>
              <Ionicons
                name="heart"
                size={24}
                color="#E63946"
                style={{ marginLeft: 2, marginRight: 2 }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerColumn: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 12,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 4,
  },
  version: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  madeIn: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "#888",
    fontSize: 12,
  },
});
