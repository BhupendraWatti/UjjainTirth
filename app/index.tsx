import React from "react";
import { useRouter } from "expo-router";
import { getStoredUser } from "@/utils/storage";
import SplashAnimation from "@/components/splash/SplashAnimation";
import SecondSplashAnimation from "@/components/splash/SecondSplashAnimation";

// Set to true to test the cinematic alternative splash screen (Stage 2)
// Set to false to use the default refined temple-silhouette splash screen (Stage 1)
const USE_ALTERNATIVE_SPLASH = true;

export default function Intro() {
  const router = useRouter();

  const handleFinish = async () => {
    try {
      const user = await getStoredUser();
      if (user?.isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    } catch (error) {
      console.log("Storage error:", error);
      router.replace("/(auth)/login" as any);
    }
  };

  if (USE_ALTERNATIVE_SPLASH) {
    return <SecondSplashAnimation onFinish={handleFinish} />;
  }

  return <SplashAnimation onFinish={handleFinish} />;
}


