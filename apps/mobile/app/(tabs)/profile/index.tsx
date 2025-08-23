import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "@/components/Themed";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}></View>
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
