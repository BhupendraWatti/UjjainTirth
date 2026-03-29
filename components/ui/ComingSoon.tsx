import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export type ComingSoonRef = {
  startAnimation: () => void;
};

const ComingSoon = forwardRef<ComingSoonRef>((props, ref) => {
  const [showText, setShowText] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const startAnimation = () => {
    setShowText(true);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.title}>🚀 Coming Soon</Text>
        <Text style={styles.subtitle}>Something exciting is on the way</Text>
      </Animated.View>
    </View>
  );
});

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4e5be",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginTop: 8,
  },
});
