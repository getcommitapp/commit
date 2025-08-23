import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";

export default function GoalsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <EditScreenInfo path="app/(tabs)/goals.tsx" />
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
});
