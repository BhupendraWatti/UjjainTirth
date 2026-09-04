import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import ParticleSystem from "./ParticleSystem";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SecondSplashAnimationProps {
  onFinish: () => void;
}

export default function SecondSplashAnimation({ onFinish }: SecondSplashAnimationProps) {
  // Animation Triggers
  const [stage, setStage] = useState(1); // 1 = Shivling, 2 = Saffron Flash, 3 = Trishul/Temple Reveal on Maroon, 4 = Final Cream Reveal

  // Reanimated Shared Values
  const bgProgress = useSharedValue(0); // 0 = Maroon, 1 = Saffron (Flash), 1.5 = Maroon, 2 = Cream
  const containerOpacity = useSharedValue(1);

  // Shivling phase values
  const shivlingOpacity = useSharedValue(0);
  const shivlingScale = useSharedValue(0.85);

  // Tripundra on Shivling values
  const tripundraOpacity = useSharedValue(0);
  const tripundraScale = useSharedValue(0.8);

  // Fiery Trishul on Shivling values
  const fieryTrishulOpacity = useSharedValue(0);
  const fieryTrishulScale = useSharedValue(0.5);
  const fieryTrishulTranslateY = useSharedValue(20);

  // Glow values
  const glowScale = useSharedValue(0.5);
  const glowOpacity = useSharedValue(0);

  // Trishul Straight rise values
  const trishulOpacity = useSharedValue(0);
  const trishulScale = useSharedValue(0.85);
  const trishulTranslateY = useSharedValue(SCREEN_HEIGHT * 0.7); // Starts completely below screen

  // Temple silhouette rise values
  const templeOpacity = useSharedValue(0);
  const templeTranslateY = useSharedValue(SCREEN_WIDTH * 0.95); // Starts completely below screen

  // Final Logo & Tagline values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-25);
  
  const finalTripundraOpacity = useSharedValue(0);
  const finalTripundraScale = useSharedValue(0.8);
  
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // ─── STAGE 1: SHIVLING & SUNRISE GLOW (0ms - 4000ms) ───
    bgProgress.value = withTiming(0, { duration: 0 });

    // Shivling and Tripundra fade in and scale gently over 4 seconds
    shivlingOpacity.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) });
    shivlingScale.value = withTiming(1.0, { duration: 4000, easing: Easing.out(Easing.sin) });

    tripundraOpacity.value = withDelay(800, withTiming(0.95, { duration: 1500 }));
    tripundraScale.value = withDelay(800, withTiming(1.0, { duration: 3200, easing: Easing.out(Easing.quad) }));

    // Fiery Trishul rises out of the top of the Shivling
    fieryTrishulOpacity.value = withDelay(1200, withTiming(0.85, { duration: 1800 }));
    fieryTrishulScale.value = withDelay(1200, withTiming(1.15, { duration: 2500, easing: Easing.out(Easing.quad) }));
    fieryTrishulTranslateY.value = withDelay(1200, withTiming(-35, { duration: 2500, easing: Easing.out(Easing.quad) }));

    // Saffron Glow behind Shivling appears and expands
    glowOpacity.value = withDelay(600, withTiming(0.7, { duration: 1500 }));
    glowScale.value = withDelay(600, withTiming(1.1, { duration: 3400, easing: Easing.out(Easing.quad) }));

    // ─── STAGE 2: SAFFRON ENERGY FLASH TRANSITION (4000ms - 5200ms) ───
    const tFlash = setTimeout(() => {
      setStage(2);
      bgProgress.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });

      glowScale.value = withTiming(2.5, { duration: 1000, easing: Easing.out(Easing.quad) });
      glowOpacity.value = withTiming(0, { duration: 1000 });

      shivlingOpacity.value = withTiming(0, { duration: 800 });
      shivlingScale.value = withTiming(1.25, { duration: 1000 });

      tripundraOpacity.value = withTiming(0, { duration: 800 });
      tripundraScale.value = withTiming(1.25, { duration: 1000 });

      fieryTrishulOpacity.value = withTiming(0, { duration: 800 });
      fieryTrishulScale.value = withTiming(2.5, { duration: 1000 });
      fieryTrishulTranslateY.value = withTiming(-100, { duration: 1000 });
    }, 4000);

    // ─── STAGE 3: RETURN TO MAROON & REVEAL TRISHUL & TEMPLE (5200ms - 9700ms) ───
    const tReturnMaroon = setTimeout(() => {
      setStage(3);
      // Transition background back to Maroon
      bgProgress.value = withTiming(1.5, { duration: 800, easing: Easing.out(Easing.ease) });

      // Reset and trigger Glow behind the Temple
      glowScale.value = 0.5;
      glowOpacity.value = withDelay(600, withTiming(0.75, { duration: 1500 }));
      glowScale.value = withDelay(600, withTiming(1.3, { duration: 2500, easing: Easing.out(Easing.quad) }));

      // Straight Trishul rises majestically from bottom center to upper center
      trishulOpacity.value = withTiming(1, { duration: 1500 });
      trishulScale.value = withTiming(1.0, { duration: 2500, easing: Easing.out(Easing.back(1.05)) });
      trishulTranslateY.value = withTiming(0, { duration: 2500, easing: Easing.out(Easing.back(1.05)) });

      // Temple Illustration rises elegantly from below the screen bottom
      templeOpacity.value = withTiming(1, { duration: 2200 });
      templeTranslateY.value = withTiming(0, { duration: 2200, easing: Easing.out(Easing.cubic) });
    }, 5200);

    // ─── STAGE 4: TRANSITION TO CREAM & REVEAL FINAL BRAND (9700ms - 12200ms) ───
    const tFinalReveal = setTimeout(() => {
      setStage(4);
      // Transition background to Cream
      bgProgress.value = withTiming(2, { duration: 1200, easing: Easing.out(Easing.quad) });

      // Straight Trishul rises completely off the top of the screen
      trishulOpacity.value = withTiming(0, { duration: 1200, easing: Easing.in(Easing.ease) });
      trishulScale.value = withTiming(1.15, { duration: 1200 });
      trishulTranslateY.value = withTiming(-SCREEN_HEIGHT * 0.45, { duration: 1500, easing: Easing.out(Easing.quad) });

      // Logo fades and slides down from top
      logoOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));
      logoTranslateY.value = withDelay(400, withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }));

      // Tripundra fades in above the logo text
      finalTripundraOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));
      finalTripundraScale.value = withDelay(400, withTiming(1.0, { duration: 1000, easing: Easing.out(Easing.back(1.1)) }));

      // Tagline fades in
      taglineOpacity.value = withDelay(1100, withTiming(1, { duration: 1000 }));
    }, 9700);

    // ─── STAGE 5: FADE OUT AND FINISH (12200ms - 12700ms) ───
    const tExit = setTimeout(() => {
      containerOpacity.value = withTiming(0, {
        duration: 450,
        easing: Easing.out(Easing.ease),
      });

      setTimeout(() => {
        onFinish();
      }, 500);
    }, 12200);

    return () => {
      clearTimeout(tFlash);
      clearTimeout(tReturnMaroon);
      clearTimeout(tFinalReveal);
      clearTimeout(tExit);
    };
  }, []);

  // Animated Styles
  const animatedBg = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgProgress.value,
      [0, 1, 1.5, 2],
      ["#5c2528", "#E88B5A", "#5c2528", "#F8F3EA"] // Maroon -> Saffron -> Maroon -> Cream
    );
    return { backgroundColor };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const shivlingStyle = useAnimatedStyle(() => ({
    opacity: shivlingOpacity.value,
    transform: [{ scale: shivlingScale.value }],
  }));

  const tripundraStyle = useAnimatedStyle(() => ({
    opacity: tripundraOpacity.value,
    transform: [{ scale: tripundraScale.value }],
  }));

  const fieryTrishulStyle = useAnimatedStyle(() => ({
    opacity: fieryTrishulOpacity.value,
    transform: [
      { scale: fieryTrishulScale.value },
      { translateY: fieryTrishulTranslateY.value }
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const trishulStyle = useAnimatedStyle(() => ({
    opacity: trishulOpacity.value,
    transform: [
      { scale: trishulScale.value },
      { translateY: trishulTranslateY.value },
    ],
  }));

  const templeStyle = useAnimatedStyle(() => ({
    opacity: templeOpacity.value,
    transform: [{ translateY: templeTranslateY.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const finalTripundraStyle = useAnimatedStyle(() => ({
    opacity: finalTripundraOpacity.value,
    transform: [{ scale: finalTripundraScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  // Border Frame style
  const frameStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      bgProgress.value,
      [0, 1, 1.5, 2],
      [
        "rgba(255, 224, 130, 0.8)", // Soft gold on Maroon
        "rgba(255, 224, 130, 0)",   // Fades out during Saffron Flash
        "rgba(255, 224, 130, 0.8)", // Returns to soft gold on Maroon return
        "rgba(212, 163, 115, 0.5)"  // Saffron/gold frame on Cream bg
      ]
    );
    return { borderColor };
  });

  return (
    <Animated.View style={[styles.container, animatedBg, containerStyle]}>
      {/* Golden Frame Border */}
      <Animated.View style={[styles.outerFrame, frameStyle]}>
        <View style={styles.innerFrame}>
          <View style={[styles.cornerDot, styles.topLeftDot]} />
          <View style={[styles.cornerDot, styles.topRightDot]} />
          <View style={[styles.cornerDot, styles.bottomLeftDot]} />
          <View style={[styles.cornerDot, styles.bottomRightDot]} />
        </View>
      </Animated.View>

      {/* Slow floating gold/saffron ambient particles */}
      <ParticleSystem count={12} />

      {/* ─── PHASE 1: SHIVLING & CENTER GLOW (Visible during first 4s) ─── */}
      <Animated.View style={[styles.centerGlow, glowStyle]} />

      <Animated.View style={[styles.shivlingContainer, shivlingStyle]}>
        <Image
          source={require("../../assets/images/splash_shivling.png")}
          style={styles.shivlingImage}
          resizeMode="contain"
        />
        {/* Sacred Tripundra on Shivling */}
        <Animated.View style={[styles.tripundraWrapper, tripundraStyle]}>
          <Image
            source={require("../../assets/images/splash_tripundra.png")}
            style={styles.tripundraImage}
            resizeMode="contain"
          />
        </Animated.View>
        {/* Fiery Trishul rising out of Shivling */}
        <Animated.View style={[styles.fieryTrishulWrapper, fieryTrishulStyle]}>
          <Image
            source={require("../../assets/images/splash_trishul_straight.png")}
            style={styles.fieryTrishulImage}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>

      {/* ─── PHASE 2: TRISHUL RISE (Visible during Maroon stage 3) ─── */}
      <Animated.View style={[styles.trishulWrapper, trishulStyle]}>
        <Image
          source={require("../../assets/images/splash_trishul_straight.png")}
          style={styles.trishulImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ─── PHASE 3: TEMPLE ILLUSTRATION (Rises in stage 3, stays in stage 4) ─── */}
      <Animated.View style={[styles.templeWrapper, templeStyle]}>
        <Image
          source={require("../../assets/images/splash_temple.png")}
          style={styles.templeImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ─── PHASE 4: FINAL CREAM BRAND REVEAL (Rises & Fades in after 9.7s) ─── */}
      
      {/* A. Top: Tripundra above Logo Text */}
      <Animated.View style={[styles.finalTripundraWrapper, finalTripundraStyle]}>
        <Image
          source={require("../../assets/images/splash_tripundra.png")}
          style={styles.finalTripundraImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* B. Center: Logo Text */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Image
          source={require("../../assets/images/splash_logo_new.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* C. Bottom Tagline */}
      <Animated.View style={[styles.taglineWrapper, taglineStyle]}>
        <View style={[styles.line, { backgroundColor: stage < 4 ? "rgba(255, 224, 130, 0.25)" : "rgba(232, 139, 90, 0.25)" }]} />
        <Text style={[styles.tagline, { color: stage < 4 ? "#FFE082" : "#555555" }]}>
          उज्जैन तीर्थ - आध्यात्मिक यात्रा की शुरुआत
        </Text>
        <View style={[styles.line, { backgroundColor: stage < 4 ? "rgba(255, 224, 130, 0.25)" : "rgba(232, 139, 90, 0.25)" }]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  outerFrame: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    borderWidth: 1.5,
    padding: 3,
    pointerEvents: "none",
    zIndex: 10,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "rgba(255, 224, 130, 0.3)",
    position: "relative",
  },
  cornerDot: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "#FFE082",
    borderWidth: 0.5,
    borderColor: "#E88B5A",
  },
  topLeftDot: { top: -3, left: -3 },
  topRightDot: { top: -3, right: -3 },
  bottomLeftDot: { bottom: -3, left: -3 },
  bottomRightDot: { bottom: -3, right: -3 },
  centerGlow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#E88B5A",
    shadowColor: "#E88B5A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 10,
    opacity: 0.7,
    left: (SCREEN_WIDTH - 250) / 2,
    top: (SCREEN_HEIGHT - 250) / 2,
  },
  shivlingContainer: {
    position: "absolute",
    width: 220,
    height: 220,
    left: (SCREEN_WIDTH - 220) / 2,
    top: (SCREEN_HEIGHT - 220) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  shivlingImage: {
    width: "100%",
    height: "100%",
  },
  tripundraWrapper: {
    position: "absolute",
    top: "32%",
    width: 70,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  tripundraImage: {
    width: "100%",
    height: "100%",
  },
  fieryTrishulWrapper: {
    position: "absolute",
    top: -50,
    width: 60,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  fieryTrishulImage: {
    width: "100%",
    height: "100%",
    tintColor: "#FFE082",
  },
  trishulWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.15,
    left: (SCREEN_WIDTH - 120) / 2,
    width: 120,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  trishulImage: {
    width: "100%",
    height: "100%",
  },
  templeWrapper: {
    position: "absolute",
    bottom: 0,
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.95) / 2,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_WIDTH * 0.95,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  templeImage: {
    width: "100%",
    height: "100%",
  },
  finalTripundraWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.12,
    left: (SCREEN_WIDTH - 90) / 2,
    width: 90,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  finalTripundraImage: {
    width: "100%",
    height: "100%",
  },
  logoWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.28,
    left: (SCREEN_WIDTH - SCREEN_WIDTH * 0.7) / 2,
    width: SCREEN_WIDTH * 0.7,
    height: (SCREEN_WIDTH * 0.7) / 4.16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  taglineWrapper: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 12,
    letterSpacing: 0.5,
  },
});
