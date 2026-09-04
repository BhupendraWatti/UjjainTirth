import { fetchOnboarding } from "@/services/onboarding";
import { setOnboardingDone } from "@/utils/storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function Onboarding() {
  const [data, setData] = useState<any[]>([]);
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
      setData(await fetchOnboarding());
    } catch (e) {
      console.log("Error:", e);
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
  const handleNext = async () => {
    if (currentIndex === data.length - 1) {
      await setOnboardingDone();
      router.replace("/(tabs)");
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    }
  };

  const renderItem = ({ item, index: i }: any) => {
    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

    // 🔥 Image Parallax
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-50, 0, 50],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width, flex: 1 }}>
        {/* IMAGE */}
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

          {/* CURVE */}
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

          {/* SKIP */}
          <TouchableOpacity
            onPress={async () => {
              await setOnboardingDone();
              router.replace("/(tabs)");
            }}
            style={{
              position: "absolute",
              top: insets.top + 12,
              right: 20,
              backgroundColor: "#ffffffaa",
              paddingHorizontal: 14,
              minHeight: 44,
              borderRadius: 20,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#333" }}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "#F5EFE7",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: isShort ? 20 : 40,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontSize: isShort ? 24 : 28,
              fontWeight: "700",
              letterSpacing: 0.5,
              color: "#3A3A3A",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {item.title}
          </Text>

          <Text
            style={{
              marginTop: isShort ? 12 : 17,
              paddingHorizontal: 20,
              fontSize: isShort ? 16 : 18,
              lineHeight: isShort ? 22 : 24,
              textAlign: "center",
              color: "#444",
              maxWidth: 300,
              fontWeight: 500,
            }}
          >
            {item.description}
          </Text>

          {/* DOTS (Animated) */}
          <View style={{ flexDirection: "row", marginTop: isShort ? 12 : 20 }}>
            {data.map((_, indexDot) => {
              const inputRange = [
                (indexDot - 1) * width,
                indexDot * width,
                (indexDot + 1) * width,
              ];

              const scaleDot = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1.4, 0.8],
                extrapolate: "clamp",
              });

              const opacityDot = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={indexDot}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 4,
                    backgroundColor: "#FF6B00",
                    transform: [{ scale: scaleDot }],
                    opacity: opacityDot,
                  }}
                />
              );
            })}
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={handleNext}
            style={{
              marginTop: isShort ? 16 : "auto",
              marginBottom: Math.max(insets.bottom + 16, isShort ? 20 : 32),
              marginRight: 24,
              alignSelf: "flex-end",
              backgroundColor: "#FF6B00",
              width: isShort ? 54 : 60,
              height: isShort ? 54 : 60,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 35,
                fontWeight: 500,
                marginBottom: 13,
              }}
            >
              →
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.stateText}>Preparing your pilgrimage…</Text>
      </View>
    );
  }

  if (error || data.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>We couldn&apos;t load the introduction</Text>
        <Text style={styles.stateText}>Check your connection and try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load}>
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
        { useNativeDriver: false },
      )}
    />
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#FF6B00",
    borderRadius: 24,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  retryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
