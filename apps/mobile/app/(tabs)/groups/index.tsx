import { StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <View style={[styles.separator, { backgroundColor: borderColor }]} />
      <EditScreenInfo path="app/(tabs)/groups.tsx" />
    </View>
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
