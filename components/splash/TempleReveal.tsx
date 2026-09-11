import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Increased size by ~15% (from 0.45 to 0.52)
const TEMPLE_WIDTH = SCREEN_WIDTH * 0.52;
const TEMPLE_HEIGHT = TEMPLE_WIDTH * 1.25;

interface TempleRevealProps {
  startTrigger: boolean;
}

const TempleReveal = React.memo(({ startTrigger }: TempleRevealProps) => {
  // Animation values
  const translateY = useSharedValue(60); 
  const opacity = useSharedValue(0);
  const breatheScale = useSharedValue(1);

  useEffect(() => {
    if (startTrigger) {
      // Smooth rising entry transition
      translateY.value = withDelay(
        200,
        withSpring(0, {
          damping: 16,
          stiffness: 55,
          mass: 1.0,
        })
      );

      // Smooth fade-in
      opacity.value = withDelay(
        200,
        withTiming(1, {
          duration: 1200,
          easing: Easing.out(Easing.quad),
        })
      );

      // Continuous breathing animation (pulse) once active
      breatheScale.value = withDelay(
        1400,
        withRepeat(
          withTiming(1.03, {
            duration: 3500,
            easing: Easing.inOut(Easing.sin),
          }),
          -1, // Loop infinitely
          true // Reverse back and forth
        )
      );
    }
  }, [startTrigger]);

  const templeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: breatheScale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Temple Silhouette SVG */}
      <Animated.View style={[styles.templeWrapper, templeAnimatedStyle]}>
        <Svg
          width={TEMPLE_WIDTH}
          height={TEMPLE_HEIGHT}
          viewBox="0 0 160 200"
          style={styles.svg}
        >
          <Defs>
            {/* Saffron to Maroon luxury gradient */}
            <LinearGradient id="templeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFE082" />
              <Stop offset="30%" stopColor="#E88B5A" />
              <Stop offset="75%" stopColor="#D4A373" />
              <Stop offset="100%" stopColor="#5c2528" />
            </LinearGradient>
            <LinearGradient id="accentLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFE082" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#E88B5A" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>

          {/* Premium mathematically symmetric Mahakaleshwar Shikhara Silhouette */}
          <Path
            d="
              M 80,30 
              C 81,32 82,35 83,38 H 84
              C 85,41 86,47 87,53 H 89
              C 91,59 92,66 94,74 H 96
              C 99,82 102,93 104,104 H 107
              C 110,115 114,127 116,140 H 120
              C 123,149 126,159 128,170
              V 178 H 138
              V 188 H 148
              V 198 H 12
              V 188 H 22
              V 178 H 32
              V 170 H 32
              C 34,159 37,149 40,140 H 44
              C 50,127 46,115 53,104 H 56
              C 61,93 58,82 64,74 H 67
              C 68,66 69,59 71,53 H 74
              C 74,47 75,41 76,38 H 77
              C 78,35 79,32 80,30 
              Z
            "
            fill="url(#templeGrad)"
            stroke="#E88B5A"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Golden Kalash finial */}
          <Path
            d="
              M 77,20 
              C 77,16 83,16 83,20
              C 83,24 77,24 77,20 
              Z
            "
            fill="#FFE082"
            stroke="#E88B5A"
            strokeWidth="0.6"
          />

          {/* Amalaka crown disc */}
          <Path
            d="
              M 73,24 
              C 73,20 87,20 87,24
              C 87,27 73,27 73,24 
              Z
            "
            fill="#D4A373"
            stroke="#E88B5A"
            strokeWidth="0.6"
          />

          {/* Waving Saffron Flag (Dhwaja) */}
          <Path
            d="
              M 80,16 V 5
              M 80,5 C 84,3 88,7 92,5 C 88,10 84,8 80,11 Z
            "
            fill="#E88B5A"
            stroke="#E88B5A"
            strokeWidth="1.0"
            strokeLinejoin="round"
          />

          {/* Trishul at top staff */}
          <Path
            d="
              M 80,10 H 77 C 77,13 83,13 83,10 Z
              M 80,7 V 13
            "
            fill="none"
            stroke="#FFE082"
            strokeWidth="0.8"
          />

          {/* Architectural Ribbing & Centered Bhumi lines */}
          <Path
            d="
              M 80,30 V 170
              M 85,38 Q 90,80 110,155
              M 75,38 Q 70,80 50,155
              
              M 79,34 H 81
              M 77,41 H 83
              M 75,48 H 85
              M 73,59 H 87
              M 70,65 H 90
              M 67,78 H 93
              M 63,90 H 97
              M 60,104 H 100
              M 55,120 H 105
              M 48,138 H 112
              M 42,155 H 118
              M 36,165 H 124
            "
            stroke="url(#accentLineGrad)"
            strokeWidth="0.8"
            opacity="0.5"
          />

          {/* Accents on base steps */}
          <Path
            d="
              M 36,170 H 124
              M 27,180 H 133
              M 19,190 H 141
            "
            stroke="#FFE082"
            strokeWidth="0.8"
            opacity="0.25"
          />
        </Svg>
      </Animated.View>
    </View>
  );
});

TempleReveal.displayName = "TempleReveal";

export default TempleReveal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.14, // Lowered slightly to tighten spacing with logo
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  templeWrapper: {
    width: TEMPLE_WIDTH,
    height: TEMPLE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    shadowColor: "#E88B5A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
