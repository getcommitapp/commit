import { Link, Stack, usePathname } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View, useThemeColor } from "@/components/Themed";

export default function NotFoundScreen() {
  const linkColor = useThemeColor({}, "link");
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn&apos;t exist.</Text>
        {!!pathname && (
          <Text style={styles.subtitle}>Requested path: {pathname}</Text>
        )}

        <Link href="/(tabs)/home" style={styles.link}>
          <Text style={[styles.linkText, { color: linkColor }]}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
