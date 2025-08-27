import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText, spacing, textVariants } from "@/components/Themed";

export default function PaymentMethodScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ThemedText style={[textVariants.body, { marginTop: spacing.md }]}>
          Coming soon.
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}
