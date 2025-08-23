import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditScreenInfo from "@/components/EditScreenInfo";
import {
  Text,
  View,
  useThemeColor,
  spacing,
  textVariants,
} from "@/components/Themed";

export default function HomeScreen() {
  const borderColor = useThemeColor({}, "border");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <View style={[styles.separator, { backgroundColor: borderColor }]} />
        <EditScreenInfo path="app/(tabs)/index.tsx" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    ...textVariants.largeTitle,
  },
  separator: {
    marginVertical: spacing.xl,
    height: 1,
    width: "100%",
  },
});
