import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ParticleProps {
  index: number;
}

// Warm saffron, gold, and peach/cream tones binned to match the redesigned brand aesthetic
const PARTICLE_COLORS = ["#E88B5A", "#D4A373", "#F5D5C0", "#E2976F", "#F6DEC9"];

const Particle = React.memo(({ index }: ParticleProps) => {
  // Distribute particles across the entire screen initially for immediate ambiance
  const startX = Math.random() * SCREEN_WIDTH;
  const startY = Math.random() * SCREEN_HEIGHT;
  
  const x = useSharedValue(startX);
  const y = useSharedValue(startY);
  const opacity = useSharedValue(0);
  
  // High-fidelity tiny sizing: 3px to 6px for delicate dust motes (not confetti)
  const size = Math.random() * 3 + 3; 
  const scale = useSharedValue(1);

  useEffect(() => {
    // Extremely slow and soothing floating durations (8 to 16 seconds)
    const duration = Math.random() * 8000 + 8000; 
    const delay = Math.random() * 3000;
    
    // Very gentle drift bounds
    const driftX = startX + (Math.random() * 60 - 30);
    const driftY = startY - (Math.random() * 150 + 50);

    // Animate Y (slow upward float)
    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(driftY, {
          duration,
          easing: Easing.out(Easing.sin),
        }),
        -1, // Loop indefinitely
        false // Reset to bottom boundary for continuous flow
      )
    );

    // Animate X (subtle sideways wave)
    x.value = withDelay(
      delay,
      withRepeat(
        withTiming(driftX, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        false
      )
    );

    // Smooth breathing fade in -> float -> fade out
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(Math.random() * 0.4 + 0.15, { duration: duration * 0.25 }),
          withTiming(Math.random() * 0.4 + 0.15, { duration: duration * 0.5 }),
          withTiming(0, { duration: duration * 0.25 })
        ),
        -1,
        false
      )
    );

    // Pulsing scaling effect
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: duration * 0.5 }),
          withTiming(1.0, { duration: duration * 0.5 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const particleColor = PARTICLE_COLORS[index % PARTICLE_COLORS.length];

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        {
          backgroundColor: particleColor,
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor: particleColor,
          shadowRadius: 3,
        },
      ]}
    />
  );
});

interface ParticleSystemProps {
  count?: number;
}

const ParticleSystem = React.memo(({ count = 15 }: ParticleSystemProps) => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </View>
  );
});

export default ParticleSystem;

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    top: 0,
    left: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    elevation: 1,
  },
});
