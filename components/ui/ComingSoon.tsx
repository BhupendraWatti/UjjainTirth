import LottieView from "lottie-react-native";
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
  const animationRef = useRef<LottieView>(null);

  const [showText, setShowText] = useState(false);
  const textOpacity = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    setShowText(false);
    textOpacity.setValue(0);
    animationRef.current?.play();
  };
  const showComingSoonText = () => {
    setShowText(true);

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  };

  const scale = useRef(new Animated.Value(0.9)).current;
  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  useEffect(() => {
    startAnimation();

    setTimeout(() => {
      showComingSoonText();
    }, 7200);
  }, []);

  const handleAnimationFinish = () => {
    setShowText(true);

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      startAnimation(); // remove if you don't want loop
    }, 6000);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  });

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        renderMode="HARDWARE"
        source={require("../../assets/animations/plane.json")}
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        style={styles.animation}
      />

      {showText && (
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.title}>Coming Soon</Text>
          <Text style={styles.subtitle}>Something exciting is coming ✨</Text>
        </Animated.View>
      )}
    </View>
  );
});

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4e5be", // ✅ match your app
    justifyContent: "center",
    alignItems: "center",
  },

  animation: {
    width: "130%", // ✅ slight overflow for cinematic feel
    height: 330,
    position: "relative",
    top: -100,
  },

  textContainer: {
    position: "absolute",
    top: "50%", // ✅ slightly below center (feels natural)
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#1A1A1A", // ✅ dark for light bg
  },

  subtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    marginTop: 6,
  },
  animationWrapper: {
    position: "absolute", // ✅ key fix
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
