import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "@/components/Themed";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        const url = initialUrl || "";
        if (url) {
          const split = url.split("#");
          const basePart = split[0];
          const hashPart = split[1] || "";
          const urlObj = new URL(basePart);
          const params = new URLSearchParams(urlObj.search);
          if (hashPart) {
            const hashParams = new URLSearchParams(hashPart);
            hashParams.forEach((v, k) => params.set(k, v));
          }
          const accessToken = params.get("access_token") || undefined;
          const refreshToken = params.get("refresh_token") || undefined;
          const code = params.get("code") || undefined;

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          } else if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }
      } catch (_) {
      } finally {
        router.replace("/");
      }
    };
    finalize();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4285F4" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: { marginTop: 16, fontSize: 16 },
});
