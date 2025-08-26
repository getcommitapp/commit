import { View } from "react-native";

import { SettingsGroup, SettingsRow } from "@/components/ui/Settings";
import {
  spacing,
  ThemedText,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import CheckCircle from "@/assets/icons/check-circle.svg";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");

  return (
    <ScreenLayout>
      <SettingsGroup title="Account">
        <SettingsRow label="Name" value="John Appleseed" />
        <SettingsRow label="Username" value="@johnny" last />
      </SettingsGroup>

      <SettingsGroup title="Payment">
        <SettingsRow
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
        <SettingsRow
          label="Method"
          value="TWINT"
          navigateTo="/(tabs)/profile/method"
          last
          testID="row-payment-method"
        />
      </SettingsGroup>
    </ScreenLayout>
  );
}
