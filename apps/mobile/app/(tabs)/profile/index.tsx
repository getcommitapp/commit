import { View } from "react-native";

import { FormGroup, FormItem } from "@/components/ui/form";
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
      <FormGroup title="Account">
        <FormItem label="Name" value="John Appleseed" />
        <FormItem label="Username" value="@johnny" />
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
      </FormGroup>
    </ScreenLayout>
  );
}
