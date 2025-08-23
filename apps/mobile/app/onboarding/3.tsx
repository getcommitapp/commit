import React from "react";
import { useRouter } from "expo-router";
import OnboardingPage from "@/components/pages/OnboardingPage";

export default function OnboardingStep3() {
  const router = useRouter();
  return (
    <OnboardingPage
      image={require("@/assets/images/onboarding/onboarding-3.png")}
      title="Join Group Goals"
      description="Accomplish your goals with friends or compete against them."
      buttonLabel="Next"
      onPress={() => router.push("/onboarding/4")}
    />
  );
}
