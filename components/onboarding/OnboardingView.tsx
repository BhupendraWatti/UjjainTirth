import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import {
  fetchOnboarding,
  DEFAULT_ONBOARDING_ITEMS,
} from "@/services/onboarding";
import { setOnboardingDone } from "@/utils/storage";
import { OnboardingItem } from "@/types/onboarding";

const LOCAL_FALLBACK_IMAGE = require("@/assets/images/Mahakaleshwar-1.jpeg");

const DEFAULT_FALLBACK_IMAGES = [
  "https://ujjaintirth.com/wp-content/uploads/2026/03/1.png",
  "https://ujjaintirth.com/wp-content/uploads/2026/03/2.jpeg",
  "https://ujjaintirth.com/wp-content/uploads/2026/03/3.png",
];

const IMAGE_HEADERS = {
  Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
};

interface BackdropItemProps {
  item: OnboardingItem;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
}

const BackdropItem = React.memo(
  ({ item, index, scrollX, itemSize }: BackdropItemProps) => {
    const [hasError, setHasError] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize],
        [0, 1, 0],
        Extrapolation.CLAMP
      );
      return { opacity };
    });

    const rawUri =
      typeof item.image === "string" && item.image.trim().length > 0
        ? item.image.trim()
        : DEFAULT_FALLBACK_IMAGES[index % DEFAULT_FALLBACK_IMAGES.length];

    const imageSource = hasError
      ? LOCAL_FALLBACK_IMAGE
      : {
          uri: rawUri,
          headers: IMAGE_HEADERS,
        };

    return (
      <Animated.View
        style={[StyleSheet.absoluteFillObject, animatedStyle]}
        collapsable={false}
      >
        <Image
          source={imageSource}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          // Keep within Android RenderEffect limit (<= 25)
          blurRadius={Platform.OS === "android" ? 18 : 35}
          priority="high"
          cachePolicy="memory-disk"
          transition={300}
          onError={() => setHasError(true)}
        />
      </Animated.View>
    );
  }
);
BackdropItem.displayName = "BackdropItem";

interface HeaderItemProps {
  item: OnboardingItem;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  isShort: boolean;
}

const HeaderItem = React.memo(
  ({ item, index, scrollX, itemSize, isShort }: HeaderItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollX.value,
        [
          (index - 0.55) * itemSize,
          index * itemSize,
          (index + 0.55) * itemSize,
        ],
        [0, 1, 0],
        Extrapolation.CLAMP
      );
      const translateY = interpolate(
        scrollX.value,
        [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize],
        [20, 0, -20],
        Extrapolation.CLAMP
      );
      return {
        opacity,
        transform: [{ translateY }],
      };
    });

    return (
      <Animated.View
        style={[styles.headerItemContainer, animatedStyle]}
        pointerEvents="none"
        collapsable={false}
      >
        <Text
          style={[
            styles.itemTitle,
            { fontSize: isShort ? 22 : 26, lineHeight: isShort ? 28 : 32 },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.itemDescription,
            {
              fontSize: isShort ? 13 : 14.5,
              lineHeight: isShort ? 18 : 21,
              marginTop: isShort ? 4 : 6,
            },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </Animated.View>
    );
  }
);
HeaderItem.displayName = "HeaderItem";

interface CarouselCardProps {
  item: OnboardingItem;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  spacing: number;
  cardWidth: number;
  cardHeight: number;
}

const CarouselCard = React.memo(
  ({
    item,
    index,
    scrollX,
    itemSize,
    spacing,
    cardWidth,
    cardHeight,
  }: CarouselCardProps) => {
    const [hasError, setHasError] = useState(false);

    const animatedCardStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * itemSize,
        index * itemSize,
        (index + 1) * itemSize,
      ];
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.88, 1, 0.88],
        Extrapolation.CLAMP
      );
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.65, 1, 0.65],
        Extrapolation.CLAMP
      );
      // Magnetic peek shift: brings side cards into the viewport so the user clearly sees the preview of previous & next slide
      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [-24, 0, 24],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ translateX }, { scale }],
        opacity,
      };
    });

    const animatedImageStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * itemSize,
        index * itemSize,
        (index + 1) * itemSize,
      ];
      const translateX = interpolate(
        scrollX.value,
        inputRange,
        [-cardWidth * 0.38, 0, cardWidth * 0.38],
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [1.20, 1.34, 1.20],
        Extrapolation.CLAMP
      );
      return {
        transform: [{ translateX }, { scale }],
      };
    });

    const rawUri =
      typeof item.image === "string" && item.image.trim().length > 0
        ? item.image.trim()
        : DEFAULT_FALLBACK_IMAGES[index % DEFAULT_FALLBACK_IMAGES.length];

    const imageSource = hasError
      ? LOCAL_FALLBACK_IMAGE
      : {
          uri: rawUri,
          headers: IMAGE_HEADERS,
        };

    return (
      <View
        style={{ width: cardWidth, marginHorizontal: spacing / 2 }}
        collapsable={false}
      >
        <Animated.View
          style={[
            styles.cardContainer,
            { width: cardWidth, height: cardHeight },
            animatedCardStyle,
          ]}
          collapsable={false}
        >
          <Animated.View
            style={[StyleSheet.absoluteFillObject, animatedImageStyle]}
            collapsable={false}
          >
            <Image
              source={imageSource}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              priority="high"
              cachePolicy="memory-disk"
              transition={300}
              onError={() => setHasError(true)}
            />
          </Animated.View>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.12)", "rgba(0,0,0,0.42)"]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
        </Animated.View>
      </View>
    );
  }
);
CarouselCard.displayName = "CarouselCard";

interface DotIndicatorProps {
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
}

const DotIndicator = React.memo(
  ({ index, scrollX, itemSize }: DotIndicatorProps) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * itemSize,
        index * itemSize,
        (index + 1) * itemSize,
      ];
      const width = interpolate(
        scrollX.value,
        inputRange,
        [8, 28, 8],
        Extrapolation.CLAMP
      );
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.35, 1, 0.35],
        Extrapolation.CLAMP
      );
      return {
        width,
        opacity,
      };
    });

    return (
      <Animated.View
        style={[styles.dot, animatedDotStyle]}
        collapsable={false}
      />
    );
  }
);
DotIndicator.displayName = "DotIndicator";

export default function OnboardingView() {
  const [data, setData] = useState<OnboardingItem[]>(DEFAULT_ONBOARDING_ITEMS);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isShort = height < 680;

  // Responsive Carousel Dimensions
  // Catalin Miron Wallpaper Animated Carousel proportions:
  // Tall, commanding mobile wallpaper frame that fills the available vertical space
  const headerTop = insets.top + (isShort ? 44 : 52);
  const headerHeight = isShort ? 72 : 84;
  const carouselMarginTop = headerTop + headerHeight + (isShort ? 6 : 12);
  const bottomPadding = Math.max(insets.bottom + 12, isShort ? 16 : 24);
  const bottomControlsHeight = 58;
  const availableHeight = height - carouselMarginTop - (bottomPadding + bottomControlsHeight);

  // Card height occupies 94% of available space (540-580px on standard phones, ~62% of screen)
  const cardHeight = Math.round(
    isShort ? height * 0.48 : Math.min(availableHeight * 0.94, height * 0.63)
  );

  // Card width matches mobile wallpaper ratio (slightly wider for commanding presence, ~0.76 of screen width)
  // Maintains clear preview peeking on edges while giving cards more horizontal body
  const cardWidth = Math.round(
    Math.min(width * 0.76, 325)
  );

  const spacing = 14;
  const itemSize = cardWidth + spacing;
  const sideSpacer = (width - cardWidth) / 2;

  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const load = useCallback(async () => {
    try {
      const items = await fetchOnboarding();
      if (items && items.length > 0) {
        setData(items);
      }
    } catch (e) {
      console.log("Onboarding fetch fallback:", e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateIndex = useCallback(
    (newIdx: number) => {
      if (
        newIdx >= 0 &&
        newIdx < data.length &&
        newIdx !== currentIndexRef.current
      ) {
        currentIndexRef.current = newIdx;
        setCurrentIndex(newIdx);
        try {
          Haptics.selectionAsync();
        } catch {
          // Haptics fallback
        }
      }
    },
    [data.length]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const idx = Math.round(event.contentOffset.x / itemSize);
      runOnJS(updateIndex)(idx);
    },
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

  const handleNext = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    if (currentIndex >= data.length - 1) {
      handleFinish();
    } else {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * itemSize,
        animated: true,
      });
    }
  };

  const isLast = data.length > 0 && currentIndex === data.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Backdrop Layer: Full-screen stack of cross-fading blurred wallpapers */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {data.map((item, idx) => (
          <BackdropItem
            key={item.id}
            item={item}
            index={idx}
            scrollX={scrollX}
            itemSize={itemSize}
          />
        ))}
        <LinearGradient
          colors={[
            "rgba(8, 14, 11, 0.48)",
            "rgba(8, 14, 11, 0.72)",
            "rgba(6, 10, 8, 0.94)",
          ]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* 2. Top Bar Layer: Step Indicator & Skip Button */}
      <View
        style={[
          styles.topBar,
          {
            top: insets.top + (Platform.OS === "ios" ? 8 : 14),
          },
        ]}
      >
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            {`0${currentIndex + 1} / 0${data.length}`}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          style={styles.skipButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Header Text Layer: Titles & Descriptions cross-fading */}
      <View
        style={[
          styles.headerSection,
          {
            top: headerTop,
            height: headerHeight,
          },
        ]}
        pointerEvents="none"
      >
        {data.map((item, idx) => (
          <HeaderItem
            key={item.id}
            item={item}
            index={idx}
            scrollX={scrollX}
            itemSize={itemSize}
            isShort={isShort}
          />
        ))}
      </View>

      {/* 4. Carousel Cards Layer: Snapping horizontal Animated.FlatList */}
      <View
        style={[
          styles.carouselSection,
          {
            marginTop: carouselMarginTop,
            height: cardHeight + 14,
          },
        ]}
      >
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemSize}
          decelerationRate="fast"
          bounces={false}
          removeClippedSubviews={false}
          initialNumToRender={data.length}
          maxToRenderPerBatch={data.length}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: itemSize,
            offset: itemSize * index,
            index,
          })}
          keyExtractor={(item) => item.id.toString()}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / itemSize);
            updateIndex(idx);
          }}
          contentContainerStyle={{
            paddingHorizontal: sideSpacer - spacing / 2,
            alignItems: "center",
          }}
          renderItem={({ item, index }) => (
            <CarouselCard
              item={item}
              index={index}
              scrollX={scrollX}
              itemSize={itemSize}
              spacing={spacing}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          )}
        />
      </View>

      {/* 5. Bottom Controls Layer: Dynamic indicators & CTA Button */}
      <View
        style={[
          styles.bottomControls,
          {
            paddingBottom: bottomPadding,
          },
        ]}
      >
        {/* Dynamic Expanding Pill Indicators */}
        <View style={styles.dotsRow}>
          {data.map((item, idx) => (
            <DotIndicator
              key={item.id}
              index={idx}
              scrollX={scrollX}
              itemSize={itemSize}
            />
          ))}
        </View>

        {/* Action Button: Next Arrow -> Begin Pilgrimage */}
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.actionButton, isLast && styles.actionButtonExpanded]}
          activeOpacity={0.85}
        >
          {isLast ? (
            <View style={styles.actionButtonExpandedContent}>
              <Text style={styles.actionButtonExpandedText}>
                Begin Pilgrimage
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#0A100D" />
            </View>
          ) : (
            <Ionicons name="arrow-forward" size={22} color="#0A100D" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A100D",
  },
  topBar: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },
  stepBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepBadgeText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  skipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderColor: "rgba(255, 255, 255, 0.28)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  headerSection: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerItemContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  itemDescription: {
    color: "#CBD5E1",
    textAlign: "center",
    paddingHorizontal: 12,
    maxWidth: 340,
    fontWeight: "400",
  },
  carouselSection: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.22)",
    backgroundColor: "#141D18",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 12,
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5B869",
    marginRight: 8,
  },
  actionButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E5B869",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E5B869",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  actionButtonExpanded: {
    width: "auto",
    paddingHorizontal: 22,
    borderRadius: 27,
  },
  actionButtonExpandedContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButtonExpandedText: {
    color: "#0A100D",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0A100D",
  },
  stateText: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
  },
});
