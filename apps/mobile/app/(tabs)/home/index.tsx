import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, spacing, textVariants } from "@/components/Themed";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <View style={styles.centerArea}>
          <EditScreenInfo path="app/(tabs)/index.tsx" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.headerContentInset,
    paddingTop: spacing.xl,
  },
  title: {
    ...textVariants.largeTitle,
    marginBottom: spacing.xxl,
  },
  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
