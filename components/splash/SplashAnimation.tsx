import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import ParticleSystem from "./ParticleSystem";
import TempleReveal from "./TempleReveal";
import BrandReveal from "./BrandReveal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const GLOW_SIZE = SCREEN_WIDTH * 1.5;

interface SplashAnimationProps {
  onFinish: () => void;
}

export default function SplashAnimation({ onFinish }: SplashAnimationProps) {
  // Coordinated triggers for component animations
  const [templeActive, setTempleActive] = useState(false);
  const [brandActive, setBrandActive] = useState(false);

  // Background Sunrise Glow animated values
  const sunriseScale = useSharedValue(0.7);
  const sunriseOpacity = useSharedValue(0);
  const glowPulse = useSharedValue(1);

  // Overall Splash Container Exit transition
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // ─── TIMELINE ANIMATION SEQUENCING (Total: ~6.0s) ───

    // Phase 1: Divine Sunrise Glow & Particles (0ms - 1000ms)
    // Warm and subtle sunrise scaling and opacity fade-in
    sunriseScale.value = withTiming(1.3, {
      duration: 2200,
      easing: Easing.out(Easing.quad),
    });
    sunriseOpacity.value = withTiming(0.75, {
      duration: 1800,
      easing: Easing.out(Easing.ease),
    });

    // Start pulsing the glow once it's fully faded in
    glowPulse.value = withDelay(
      1800,
      withRepeat(
        withTiming(1.08, {
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
        }),
        -1, // Infinite loop
        true // Reverse direction on each iteration
      )
    );

    // Phase 2: Mahakal-inspired Temple Spire rises (900ms)
    const tTemple = setTimeout(() => {
      setTempleActive(true);
    }, 900);

    // Phase 3: Brand Reveal Monogram + Name (2200ms)
    const tBrand = setTimeout(() => {
      setBrandActive(true);
    }, 2200);

    // Phase 4: Begin graceful fade-out transition (5500ms)
    const tExit = setTimeout(() => {
      containerOpacity.value = withTiming(0, {
        duration: 450,
        easing: Easing.out(Easing.ease),
      });

      // Complete transition callback to the main app (6000ms)
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 5500);

    return () => {
      clearTimeout(tTemple);
      clearTimeout(tBrand);
      clearTimeout(tExit);
    };
  }, []);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const sunriseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sunriseScale.value * glowPulse.value }],
    opacity: sunriseOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* 1. Slow-floating Gold & Saffron dust particles */}
      <ParticleSystem count={15} />

      {/* 2. Soft Sunrise Glow (cream radial glow #F5D5C0 with soft saffron center #E88B5A) */}
      <Animated.View style={[styles.sunriseGlow, sunriseStyle]}>
        <Svg width={GLOW_SIZE} height={GLOW_SIZE} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient
              id="sunriseGrad"
              cx="100"
              cy="100"
              r="100"
              fx="100"
              fy="100"
              gradientUnits="userSpaceOnUse"
            >
              {/* Soft saffron center */}
              <Stop offset="0%" stopColor="#E88B5A" stopOpacity="0.8" />
              {/* Large cream/apricot glow */}
              <Stop offset="45%" stopColor="#F5D5C0" stopOpacity="0.55" />
              <Stop offset="75%" stopColor="#F5D5C0" stopOpacity="0.2" />
              {/* Blends smoothly into the background page color */}
              <Stop offset="100%" stopColor="#F8F3EA" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="100" cy="100" r="100" fill="url(#sunriseGrad)" />
        </Svg>
      </Animated.View>

      {/* 3. Mahakaleshwar Temple Silhouette Layer */}
      <TempleReveal startTrigger={templeActive} />

      {/* 4. Brand Reveal (Monogram, Name, Divider, Tagline) Layer */}
      <BrandReveal startTrigger={brandActive} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F3EA", // Warm light paper/sand background
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  sunriseGlow: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.05, // Centered behind the temple shikhara area
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
});
