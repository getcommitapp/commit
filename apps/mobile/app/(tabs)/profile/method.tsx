import { SafeAreaView, ScrollView } from "react-native";
import { Text, spacing, textVariants } from "@/components/Themed";

export default function PaymentMethodScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={[textVariants.body, { marginTop: spacing.md }]}>
          Coming soon.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
