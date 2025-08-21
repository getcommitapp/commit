import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import {
  Text,
  View,
  useThemeColor,
  spacing,
  textVariants,
} from "@/components/Themed";

export default function TabOneScreen() {
  const borderColor = useThemeColor({}, "border");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={[styles.separator, { backgroundColor: borderColor }]} />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
