import React from "react";
import { useRouter } from "expo-router";
import OnboardingPage from "@/components/pages/OnboardingPage";

export default function OnboardingStep2() {
  const router = useRouter();
  return (
    <OnboardingPage
      image={require("@/assets/images/onboarding/onboarding-2.png")}
      title="Verify Your Progress"
      description="Keep track of your goals and improve yourself."
      buttonLabel="Next"
      onPress={() => router.push("/onboarding/3")}
    />
  );
}
