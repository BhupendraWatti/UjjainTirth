import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";

export type ComingSoonRef = {
  startAnimation: () => void;
};

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
}

const ComingSoon = forwardRef<ComingSoonRef, ComingSoonProps>(
  (
    { title = "🚀 Coming Soon", subtitle = "Something exciting is on the way" },
    ref,
  ) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    const startAnimation = () => {
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
      </View>
    );
  },
);

ComingSoon.displayName = "ComingSoon";

export default ComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 0,
  },

  textContainer: {
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 8,
  },
});
