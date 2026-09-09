import React from "react";
import { useRouter } from "expo-router";
import AuthVerificationView from "@/components/auth/AuthVerificationView";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <AuthVerificationView
      showSkip={true}
      onSuccess={() => {
        router.replace("/(tabs)");
      }}
      onSkip={() => {
        router.back();
      }}
    />
  );
}
