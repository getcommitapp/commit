import { View } from "react-native";

import { Form, FormItem } from "@/components/ui/Form";
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
      <Form title="Account">
        <FormItem label="Name" value="John Appleseed" />
        <FormItem label="Username" value="@johnny" last />
      </Form>

      <Form title="Payment">
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
          last
          testID="row-payment-method"
        />
      </Form>
    </ScreenLayout>
  );
}
