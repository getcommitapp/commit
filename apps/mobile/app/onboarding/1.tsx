import React from "react";
import { useRouter } from "expo-router";
import OnboardingPage from "@/components/pages/OnboardingPage";

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <OnboardingPage
      image={require("@/assets/images/onboarding/onboarding-1.png")}
      title="Set Real Stakes"
      description="Create personal goals with financial stakes. Real money means real commitment."
      buttonLabel="Next"
      onPress={() => router.push("/onboarding/2")}
    />
  );
}
