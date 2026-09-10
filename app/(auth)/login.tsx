import React from "react";
import { useRouter } from "expo-router";
import AuthVerificationView from "@/components/auth/AuthVerificationView";
import { isOnboardingDone, setOnboardingDone } from "@/utils/storage";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <AuthVerificationView
      showSkip={true}
      onSuccess={() => {
        // Destination after OTP verification: existing Onboarding screen
        router.replace("/(auth)/onboarding");
      }}
      onSkip={() => {
        router.back();
      }}
    />
  );
}

