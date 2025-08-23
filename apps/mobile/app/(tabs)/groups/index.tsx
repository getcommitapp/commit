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

export default function GroupsScreen() {
  const borderColor = useThemeColor({}, "border");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Groups</Text>
        <View style={[styles.separator, { backgroundColor: borderColor }]} />
        <EditScreenInfo path="app/(tabs)/groups.tsx" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...textVariants.title1,
  },
  separator: {
    marginVertical: spacing.xl,
    height: 1,
    width: "80%",
  },
});
