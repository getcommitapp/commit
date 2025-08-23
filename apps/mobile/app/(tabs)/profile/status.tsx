import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, spacing, textVariants } from "@/components/Themed";

export default function StatusScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: spacing.xl }}>
        <Text style={textVariants.title2}>Account Status</Text>
        <Text style={[textVariants.body, { marginTop: spacing.md }]}>
          Active. More details soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
