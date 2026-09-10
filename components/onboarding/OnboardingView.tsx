import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { fetchOnboarding } from "@/services/onboarding";
import { setOnboardingDone } from "@/utils/storage";
import { OnboardingItem } from "@/types/onboarding";

export default function OnboardingView() {
  const [data, setData] = useState<OnboardingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isShort = height < 650;
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const rawData = await fetchOnboarding();
      // Filter out invalid items (such as test posts without descriptions)
      const validItems = (rawData || []).filter(
        (item) =>
          item.description &&
          item.description.trim().length > 0 &&
          !item.title.toLowerCase().includes("screen one otp")
      );
      setData(validItems);
    } catch (e) {
      console.log("Onboarding fetch error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const viewConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const handleFinish = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics fallback
    }
    await setOnboardingDone();
    router.replace("/(tabs)");
  };

  const handleNext = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    if (currentIndex === data.length - 1) {
      handleFinish();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const renderItem = ({ item, index: i }: { item: OnboardingItem; index: number }) => {
    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

    // Image Parallax Effect
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-50, 0, 50],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width, flex: 1 }}>
        {/* Top Image */}
        <View style={{ height: isShort ? "52%" : "60%" }}>
          <Animated.Image
            source={{ uri: item.image }}
            style={{
              width: "100%",
              height: "100%",
              transform: [{ translateX }],
            }}
            resizeMode="cover"
          />

          {/* Curved Transition Wave */}
          <Svg
            height={isShort ? 110 : 140}
            width={width}
            style={{
              position: "absolute",
              bottom: -1,
            }}
          >
            <Path
              d={`M0,60 Q${width / 2},220 ${width},60 L${width},160 L0,160 Z`}
              fill="#F5EFE7"
            />
          </Svg>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleFinish}
            style={[styles.skipButton, { top: insets.top + 12 }]}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <Animated.View
          style={[
            styles.contentContainer,
            { paddingTop: isShort ? 20 : 40 },
          ]}
        >
          <Text style={[styles.itemTitle, { fontSize: isShort ? 24 : 28 }]}>
            {item.title}
          </Text>

          <Text
            style={[
              styles.itemDescription,
              {
                fontSize: isShort ? 15 : 17,
                lineHeight: isShort ? 22 : 25,
                marginTop: isShort ? 10 : 16,
              },
            ]}
          >
            {item.description}
          </Text>

          {/* Animated Indicator Dots */}
          <View style={[styles.dotsRow, { marginTop: isShort ? 14 : 22 }]}>
            {data.map((_, indexDot) => {
              const dotInputRange = [
                (indexDot - 1) * width,
                indexDot * width,
                (indexDot + 1) * width,
              ];

              const scaleDot = scrollX.interpolate({
                inputRange: dotInputRange,
                outputRange: [0.8, 1.4, 0.8],
                extrapolate: "clamp",
              });

              const opacityDot = scrollX.interpolate({
                inputRange: dotInputRange,
                outputRange: [0.35, 1, 0.35],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={indexDot}
                  style={[
                    styles.dot,
                    {
                      transform: [{ scale: scaleDot }],
                      opacity: opacityDot,
                      backgroundColor: "#0E5E43",
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.nextButton,
              {
                marginTop: isShort ? 16 : "auto",
                marginBottom: Math.max(insets.bottom + 16, isShort ? 20 : 32),
                width: isShort ? 54 : 60,
                height: isShort ? 54 : 60,
                borderRadius: isShort ? 27 : 30,
              },
            ]}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#0E5E43" />
        <Text style={styles.stateText}>Preparing your pilgrimage…</Text>
      </View>
    );
  }

  if (error || data.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>We couldn&apos;t load the introduction</Text>
        <Text style={styles.stateText}>Check your connection and try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load} activeOpacity={0.8}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      scrollEventThrottle={16}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfig}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5EFE7",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
  },
  skipButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    paddingHorizontal: 16,
    minHeight: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  skipText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  itemTitle: {
    fontWeight: "800",
    letterSpacing: 0.3,
    color: "#2C251D",
    textAlign: "center",
    marginTop: 10,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  itemDescription: {
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#554E45",
    maxWidth: 320,
    fontWeight: "500",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginHorizontal: 4,
  },
  nextButton: {
    marginRight: 24,
    alignSelf: "flex-end",
    backgroundColor: "#0E5E43",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#0E5E43",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  nextButtonArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "500",
    marginTop: -4,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F5EFE7",
  },
  stateTitle: {
    color: "#3A3A3A",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  stateText: {
    color: "#555",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 12,
  },
  retryButton: {
    minHeight: 48,
    justifyContent: "center",
    backgroundColor: "#0E5E43",
    borderRadius: 24,
    paddingHorizontal: 26,
    marginTop: 20,
  },
  retryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
