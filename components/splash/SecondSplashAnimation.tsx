import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import ParticleSystem from "./ParticleSystem";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Logo dimensions and center Y calculation
const LOGO_WIDTH = SCREEN_WIDTH * 0.72;
const LOGO_HEIGHT = LOGO_WIDTH / 4.16;
const LOGO_TOP = SCREEN_HEIGHT * 0.26;
const LOGO_CENTER_Y = LOGO_TOP + LOGO_HEIGHT / 2;

// Soft sunrise aura size and exact centered coordinates
const GLOW_SIZE = SCREEN_WIDTH * 1.35;
const GLOW_TOP = LOGO_CENTER_Y - GLOW_SIZE / 2;
const GLOW_LEFT = (SCREEN_WIDTH - GLOW_SIZE) / 2;

interface SecondSplashAnimationProps {
  onFinish: () => void;
}

export default function SecondSplashAnimation({ onFinish }: SecondSplashAnimationProps) {
  // Reanimated Shared Values
  const containerOpacity = useSharedValue(1);

  // Background Sunrise Glow (Soft radial gradient - no hard circle outline)
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.7);

  // Top Sacred Tripundra
  const tripundraOpacity = useSharedValue(0);
  const tripundraScale = useSharedValue(0.85);

  // Main Brand Logo & Tagline (Fade-in animation)
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const logoTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);

  // Temple Towers Illustration (Bottom-to-Up rising animation)
  const templeOpacity = useSharedValue(0);
  const templeTranslateY = useSharedValue(SCREEN_HEIGHT * 0.35); // Starts below the screen bottom

  useEffect(() => {
    // ─── STREAMLINED ELEGANT SPLASH SEQUENCE (~3.4s) ───

    // 1. Soft Ambient Sunrise Glow fade-in & gentle scale
    glowOpacity.value = withTiming(0.65, {
      duration: 1600,
      easing: Easing.out(Easing.quad),
    });
    glowScale.value = withTiming(1.15, {
      duration: 2500,
      easing: Easing.out(Easing.sin),
    });

    // 2. Temple Illustration rises smoothly from BOTTOM to TOP
    templeOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 1400,
        easing: Easing.out(Easing.cubic),
      })
    );
    templeTranslateY.value = withDelay(
      200,
      withTiming(0, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      })
    );

    // 3. Top Tripundra symbol fades in gently
    tripundraOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      })
    );
    tripundraScale.value = withDelay(
      400,
      withTiming(1.0, {
        duration: 1000,
        easing: Easing.out(Easing.back(1.1)),
      })
    );

    // 4. Main UjjainTirth Logo image & Tagline fade in
    logoOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 1100,
        easing: Easing.out(Easing.ease),
      })
    );
    logoScale.value = withDelay(
      600,
      withTiming(1.0, {
        duration: 1100,
        easing: Easing.out(Easing.back(1.05)),
      })
    );
    logoTranslateY.value = withDelay(
      600,
      withTiming(0, {
        duration: 1100,
        easing: Easing.out(Easing.back(1.05)),
      })
    );

    // Tagline text fades in with a slight delay
    taglineOpacity.value = withDelay(
      1100,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      })
    );

    // 5. Exit Transition to Main App (3200ms trigger, 500ms fade)
    const tExit = setTimeout(() => {
      containerOpacity.value = withTiming(0, {
        duration: 450,
        easing: Easing.out(Easing.ease),
      });

      setTimeout(() => {
        onFinish();
      }, 500);
    }, 3200);

    return () => {
      clearTimeout(tExit);
    };
  }, []);

  // Animated Styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const tripundraStyle = useAnimatedStyle(() => ({
    opacity: tripundraOpacity.value,
    transform: [{ scale: tripundraScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const templeStyle = useAnimatedStyle(() => ({
    opacity: templeOpacity.value,
    transform: [{ translateY: templeTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Golden Frame Border */}
      <View style={styles.outerFrame}>
        <View style={styles.innerFrame}>
          <View style={[styles.cornerDot, styles.topLeftDot]} />
          <View style={[styles.cornerDot, styles.topRightDot]} />
          <View style={[styles.cornerDot, styles.bottomLeftDot]} />
          <View style={[styles.cornerDot, styles.bottomRightDot]} />
        </View>
      </View>

      {/* Floating Ambient Saffron/Gold Particles */}
      <ParticleSystem count={14} />

      {/* Soft Sunrise Aura (Seamless radial gradient without any hard circle borders) */}
      <Animated.View style={[styles.sunriseGlow, glowStyle]}>
        <Svg width={GLOW_SIZE} height={GLOW_SIZE} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient
              id="softSunriseGrad"
              cx="100"
              cy="100"
              r="100"
              fx="100"
              fy="100"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#E88B5A" stopOpacity="0.45" />
              <Stop offset="45%" stopColor="#F5D5C0" stopOpacity="0.30" />
              <Stop offset="75%" stopColor="#F5D5C0" stopOpacity="0.10" />
              <Stop offset="100%" stopColor="#F8F3EA" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="100" cy="100" r="100" fill="url(#softSunriseGrad)" />
        </Svg>
      </Animated.View>

      {/* Top Sacred Tripundra */}
      <Animated.View style={[styles.tripundraWrapper, tripundraStyle]}>
        <Image
          source={require("../../assets/images/splash_tripundra.png")}
          style={styles.tripundraImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Center UjjainTirth Logo (Fade-In Animation) */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Image
          source={require("../../assets/images/splash_logo_new.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Center Tagline Text */}
      <Animated.View style={[styles.taglineWrapper, taglineStyle]}>
        <View style={styles.dividerLine} />
        <Text style={styles.taglineText}>
          उज्जैन तीर्थ - आध्यात्मिक यात्रा की शुरुआत
        </Text>
        <View style={styles.dividerLine} />
      </Animated.View>

      {/* Bottom Temple Illustration (Bottom-to-Up Animation) */}
      <Animated.View style={[styles.templeWrapper, templeStyle]}>
        <Image
          source={require("../../assets/images/splash_temple.png")}
          style={styles.templeImage}
          resizeMode="contain"
        />
      </Animated.View>
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
  outerFrame: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    borderWidth: 1.2,
    borderColor: "rgba(212, 163, 115, 0.45)",
    padding: 4,
    pointerEvents: "none",
    zIndex: 10,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "rgba(232, 139, 90, 0.25)",
    position: "relative",
  },
  cornerDot: {
    position: "absolute",
    width: 5,
    height: 5,
    backgroundColor: "#FFE082",
    borderWidth: 0.5,
    borderColor: "#E88B5A",
  },
  topLeftDot: { top: -3, left: -3 },
  topRightDot: { top: -3, right: -3 },
  bottomLeftDot: { bottom: -3, left: -3 },
  bottomRightDot: { bottom: -3, right: -3 },
  sunriseGlow: {
    position: "absolute",
    top: GLOW_TOP,
    left: GLOW_LEFT,
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  tripundraWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.12,
    width: 90,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  tripundraImage: {
    width: "100%",
    height: "100%",
  },
  logoWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.26,
    width: SCREEN_WIDTH * 0.72,
    height: (SCREEN_WIDTH * 0.72) / 4.16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  taglineWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(232, 139, 90, 0.3)",
  },
  taglineText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A4A4A",
    textAlign: "center",
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  templeWrapper: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH * 0.96,
    height: SCREEN_WIDTH * 0.96,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  templeImage: {
    width: "100%",
    height: "100%",
  },
});
