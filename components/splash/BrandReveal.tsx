import React, { useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface BrandRevealProps {
  startTrigger: boolean;
}

const BrandReveal = React.memo(({ startTrigger }: BrandRevealProps) => {
  // Animation values
  const containerOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.75);
  const logoTranslateY = useSharedValue(15);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    if (startTrigger) {
      // Container fades in smoothly
      containerOpacity.value = withTiming(1, {
        duration: 900,
        easing: Easing.out(Easing.ease),
      });

      // Logo scales up and rises gently into position
      logoScale.value = withTiming(1, {
        duration: 1100,
        easing: Easing.out(Easing.back(1.1)),
      });
      logoTranslateY.value = withTiming(0, {
        duration: 1100,
        easing: Easing.out(Easing.back(1.1)),
      });

      // Brand text fades and moves up shortly after
      textOpacity.value = withDelay(
        500,
        withTiming(1, {
          duration: 900,
          easing: Easing.out(Easing.quad),
        })
      );
      textTranslateY.value = withDelay(
        500,
        withTiming(0, {
          duration: 900,
          easing: Easing.out(Easing.quad),
        })
      );

      // Tagline & Divider fade in at the final phase
      taglineOpacity.value = withDelay(
        1000,
        withTiming(1, {
          duration: 900,
          easing: Easing.out(Easing.ease),
        })
      );
    }
  }, [startTrigger]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* 1. Vector Monogram (Clean, minimal, without decorative dotted rings) */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <Svg width={76} height={76} viewBox="0 0 100 100">
          <Defs>
            {/* Custom gold to saffron gradient */}
            <LinearGradient id="monogramGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFE082" />
              <Stop offset="50%" stopColor="#D4A373" />
              <Stop offset="100%" stopColor="#E88B5A" />
            </LinearGradient>
          </Defs>
          
          {/* Flag (Dhwaja) at the top of the central staff */}
          <Path
            d="M 50,22 V 12 C 53,10 56,14 60,12 C 57,16 54,15 50,18"
            fill="#E88B5A"
            stroke="#E88B5A"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          
          {/* Trident / UT monogram paths */}
          {/* Central Staff */}
          <Path d="M 50,22 V 68" stroke="url(#monogramGold)" strokeWidth="3.5" strokeLinecap="round" />
          {/* T-Crossbar */}
          <Path d="M 39,32 H 61" stroke="url(#monogramGold)" strokeWidth="3.5" strokeLinecap="round" />
          {/* U-Shape bowl */}
          <Path
            d="M 32,38 C 32,64 50,68 50,68 C 50,68 68,64 68,38"
            fill="none"
            stroke="url(#monogramGold)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          
          {/* Bottom decorative base pedestal curve */}
          <Path
            d="M 37,74 Q 50,77 63,74"
            fill="none"
            stroke="#E88B5A"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </Svg>
      </Animated.View>

      {/* 2. Brand Name Typography (Centered, Saffron/Charcoal Accent) */}
      <Animated.View style={[styles.brandTextContainer, textStyle]}>
        <Text style={styles.brandUjjain}>UJJAIN</Text>
        <Text style={styles.brandTirth}> TIRTH</Text>
      </Animated.View>

      {/* Elegant Decorative Divider */}
      <Animated.View style={[styles.dividerContainer, taglineStyle]}>
        <Animated.View style={styles.line} />
        <Text style={styles.dot}>✦</Text>
        <Animated.View style={styles.line} />
      </Animated.View>

      {/* 3. Tagline */}
      <Animated.View style={[styles.taglineWrapper, taglineStyle]}>
        <Text style={styles.tagline}>Your Sacred Journey Begins Here</Text>
      </Animated.View>
    </Animated.View>
  );
});

export default BrandReveal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.49, // Positioned precisely below the temple shikhara base
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  brandTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  brandUjjain: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3A3A3A",
    letterSpacing: 5,
  },
  brandTirth: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E88B5A",
    letterSpacing: 5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
    width: SCREEN_WIDTH * 0.45,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(212, 163, 115, 0.25)", // Soft gold accent line
  },
  dot: {
    color: "#D4A373", // Accent color
    fontSize: 10,
    marginHorizontal: 8,
    opacity: 0.9,
  },
  taglineWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    fontSize: 14, // Increased size for contrast
    color: "#4A4A4A", // Darker text color for high readability
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 1.2,
  },
});
