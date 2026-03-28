import { fetchOnboarding } from "@/services/onboarding";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
const { width } = Dimensions.get("window");

export default function Onboarding() {
  const [data, setData] = useState<any[]>([]);
  // const [index, setIndex] = useState(0);
  // const flatRef = useRef<FlatList>(null);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  // useEffect(() => {
  //   load();
  // }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  // const load = async () => {
  //   const { data, isLoading } = useQuery({
  //     queryKey: ["onboarding"],
  //     queryFn: fetchOnboarding,
  //   });
  // };

  // const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchOnboarding();
        setData(res);
      } catch (e) {
        console.log("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  const viewConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const handleNext = async () => {
    if (currentIndex === data.length - 1) {
      // await setOnboardingDone();
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

    // 🔥 Content Animation
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width, flex: 1 }}>
        {/* IMAGE */}
        <View style={{ height: "60%" }}>
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
            height={140}
            width={width}
            style={{
              position: "absolute",
              bottom: -1,
            }}
          >
            <Path
              d={`M0,60 Q${width / 2},140 ${width},60 L${width},160 L0,160 Z`}
              fill="#F5EFE7"
            />
          </Svg>

          {/* SKIP */}
          <TouchableOpacity
            onPress={async () => {
              // await setOnboardingDone();
              router.replace("/(tabs)");
            }}
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              backgroundColor: "#ffffffaa",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
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
            paddingTop: 40,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              letterSpacing: 0.5,
              color: "#3A3A3A",
              textAlign: "center",
            }}
          >
            {item.title}
          </Text>

          <Text
            style={{
              marginTop: 12,
              paddingHorizontal: 20,
              fontSize: 14,
              lineHeight: 20,
              textAlign: "center",
              color: "#444",
              maxWidth: 300,
            }}
          >
            {item.description}
          </Text>

          {/* DOTS (Animated) */}
          <View style={{ flexDirection: "row", marginTop: 20 }}>
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
              position: "absolute",
              bottom: 50,
              right: 24,
              backgroundColor: "#FF6B00",
              width: 60,
              height: 60,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20 }}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

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
