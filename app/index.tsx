import { isOnboardingDone } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
export default function Intro() {
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      // Play animation
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1300));

      try {
        const done = await isOnboardingDone();

        // if (done) {
        //   router.replace("/(tabs)");
        // } else {
        //   router.replace("/(auth)/onboarding" as any);
        // }
        router.replace("/(auth)/onboarding" as any);
      } catch (error) {
        console.log("Storage error:", error);
        router.replace("/(auth)/onboarding" as any);
      }
    };

    init();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.Image
        source={require("../assets/images/ujjain_tirth_logo.png")}
        style={{ width: 160, height: 160, opacity: logoOpacity }}
        resizeMode="contain"
      />
    </View>
  );
}
