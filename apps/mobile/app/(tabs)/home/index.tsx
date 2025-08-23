import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, spacing, textVariants } from "@/components/Themed";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.md,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>Welcome back</Text>
        <EditScreenInfo path="app/(tabs)/index.tsx" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    ...textVariants.largeTitle,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
});
