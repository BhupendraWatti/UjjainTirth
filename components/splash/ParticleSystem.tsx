import React, { useEffect, useMemo } from "react";
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

// Pre-compute stable seeds for all particles at module load time (never changes on re-render)
const MAX_PARTICLES = 20;
const PARTICLE_SEEDS = Array.from({ length: MAX_PARTICLES }, () => ({
  startX: Math.random() * SCREEN_WIDTH,
  startY: Math.random() * SCREEN_HEIGHT,
  size: Math.random() * 3 + 3,
  duration: Math.random() * 8000 + 8000,
  delay: Math.random() * 3000,
  driftDx: Math.random() * 60 - 30,
  driftDy: Math.random() * 150 + 50,
  opacityA: Math.random() * 0.4 + 0.15,
  opacityB: Math.random() * 0.4 + 0.15,
}));

const Particle = React.memo(({ index }: ParticleProps) => {
  // Stable seed — never recomputed on re-render, preventing shared value recreation
  const seed = useMemo(() => PARTICLE_SEEDS[index % MAX_PARTICLES], [index]);

  const x = useSharedValue(seed.startX);
  const y = useSharedValue(seed.startY);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const { startX, startY, duration, delay, driftDx, driftDy, opacityA, opacityB } = seed;

    const driftX = startX + driftDx;
    const driftY = startY - driftDy;

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
          withTiming(opacityA, { duration: duration * 0.25 }),
          withTiming(opacityB, { duration: duration * 0.5 }),
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
  }, [seed]);

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
          width: seed.size,
          height: seed.size,
          borderRadius: seed.size / 2,
          shadowColor: particleColor,
          shadowRadius: 3,
        },
      ]}
    />
  );
});

Particle.displayName = "Particle";

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

ParticleSystem.displayName = "ParticleSystem";

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
