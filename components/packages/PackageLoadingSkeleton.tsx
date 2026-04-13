import { COLORS } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const PackageLoadingSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonCard = () => (
    <Animated.View style={[styles.card, { opacity }]}>
      {/* Image placeholder */}
      <View style={styles.imagePlaceholder} />

      {/* Content placeholder */}
      <View style={styles.content}>
        <View style={styles.titleBar} />
        <View style={styles.descBar} />
        <View style={styles.descBarShort} />

        {/* Chips placeholder */}
        <View style={styles.chipRow}>
          <View style={styles.chipPlaceholder} />
          <View style={styles.chipPlaceholder} />
          <View style={styles.chipPlaceholder} />
        </View>

        {/* Buttons placeholder */}
        <View style={styles.buttonRow}>
          <View style={styles.buttonPlaceholder} />
          <View style={styles.buttonPlaceholderFilled} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
};

export default PackageLoadingSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#E8E4DD",
    borderRadius: 18,
    marginHorizontal: 14,
    marginBottom: 16,
    overflow: "hidden",
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: "#DDD8D0",
  },
  content: {
    padding: 16,
  },
  titleBar: {
    height: 18,
    width: "60%",
    backgroundColor: "#DDD8D0",
    borderRadius: 8,
    marginBottom: 10,
  },
  descBar: {
    height: 12,
    width: "90%",
    backgroundColor: "#DDD8D0",
    borderRadius: 6,
    marginBottom: 6,
  },
  descBarShort: {
    height: 12,
    width: "70%",
    backgroundColor: "#DDD8D0",
    borderRadius: 6,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  chipPlaceholder: {
    height: 28,
    width: 80,
    backgroundColor: "#DDD8D0",
    borderRadius: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  buttonPlaceholder: {
    flex: 1,
    height: 42,
    backgroundColor: "#DDD8D0",
    borderRadius: 12,
  },
  buttonPlaceholderFilled: {
    flex: 1,
    height: 42,
    backgroundColor: "#D6CEC6",
    borderRadius: 12,
  },
});
