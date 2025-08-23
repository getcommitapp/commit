import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditScreenInfo from "@/components/EditScreenInfo";
import { spacing } from "@/components/Themed";

export default function GroupsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.headerContentInset,
          paddingTop: spacing.md,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <EditScreenInfo path="app/(tabs)/groups.tsx" />
      </ScrollView>
    </SafeAreaView>
  );
}
