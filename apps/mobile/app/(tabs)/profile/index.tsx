import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsGroup, SettingsRow } from "@/components/ui/Settings";
import {
  spacing,
  Text,
  textVariants,
  useThemeColor,
} from "@/components/Themed";
import CheckCircle from "@/assets/icons/check-circle.svg";

export default function ProfileScreen() {
  const success = useThemeColor({}, "success");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.md,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
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
                <Text
                  style={{
                    ...textVariants.bodyEmphasized,
                    color: success,
                  }}
                >
                  Active
                </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
