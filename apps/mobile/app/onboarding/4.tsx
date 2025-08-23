import React from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingPage from "@/components/pages/OnboardingPage";

export default function OnboardingStep4() {
  const router = useRouter();
  const finish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(tabs)");
  };
  return (
    <OnboardingPage
      image={require("@/assets/images/onboarding/onboarding-4.png")}
      title="Compete"
      description="Gain money by competing with other users."
      buttonLabel="Get started"
      onPress={finish}
    />
  );
}
