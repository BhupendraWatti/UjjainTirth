import React, { memo, useCallback } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LayoutAnimationConfig,
  LinearTransition,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { icons } from "@/components/ui/Icons";

// Spring transition configs for fluid physical tab morphing
const TAB_LAYOUT_TRANSITION = LinearTransition.springify()
  .damping(16)
  .stiffness(150)
  .mass(0.7);

const LABEL_ENTER_ANIMATION = FadeInRight.springify()
  .damping(15)
  .stiffness(140);

const LABEL_EXIT_ANIMATION = FadeOutLeft.duration(120);

// Route to brand icon mapping
const ROUTE_ICON_MAP: Record<
  string,
  {
    active: any;
    inactive: any;
    defaultTitle: string;
  }
> = {
  index: {
    active: icons.home.active,
    inactive: icons.home.inactive,
    defaultTitle: "Home",
  },
  temples: {
    active: icons.temple.active,
    inactive: icons.temple.inactive,
    defaultTitle: "Temples",
  },
  packages: {
    active: icons.packages.active,
    inactive: icons.packages.inactive,
    defaultTitle: "Packages",
  },
  puja: {
    active: icons.puja.active,
    inactive: icons.puja.inactive,
    defaultTitle: "Puja",
  },
  more: {
    active: icons.more.active,
    inactive: icons.more.inactive,
    defaultTitle: "More",
  },
};

interface TabItemProps {
  routeKey: string;
  routeName: string;
  isFocused: boolean;
  label: string;
  iconActive: any;
  iconInactive: any;
  iconSize: number;
  isCompact: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem = memo(
  ({
    isFocused,
    label,
    iconActive,
    iconInactive,
    iconSize,
    isCompact,
    onPress,
    onLongPress,
  }: TabItemProps) => {
    // Subtle physical spring punch on the active icon without shrinking inactive icons
    const animatedIconStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withSpring(isFocused ? 1.05 : 0.96, {
              damping: 14,
              stiffness: 160,
              mass: 0.6,
            }),
          },
        ],
        opacity: withSpring(isFocused ? 1 : 0.75, {
          damping: 15,
          stiffness: 150,
        }),
      };
    }, [isFocused]);

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.78}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={label}
        hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
        style={styles.tabButton}
      >
        <Animated.View
          layout={TAB_LAYOUT_TRANSITION}
          style={[
            styles.pill,
            isFocused ? styles.pillActive : styles.pillInactive,
            isCompact && styles.pillCompact,
            isFocused && isCompact && styles.pillActiveCompact,
          ]}
          collapsable={false}
        >
          <Animated.View style={animatedIconStyle} collapsable={false}>
            <Image
              source={isFocused ? iconActive : iconInactive}
              style={{ width: iconSize, height: iconSize }}
              resizeMode="contain"
            />
          </Animated.View>

          {/* skipEntering ensures the active tab label doesn't awkwardly animate on initial mount */}
          <LayoutAnimationConfig skipEntering>
            {isFocused && (
              <Animated.Text
                entering={LABEL_ENTER_ANIMATION}
                exiting={LABEL_EXIT_ANIMATION}
                style={[styles.label, isCompact && styles.labelCompact]}
                numberOfLines={1}
              >
                {label}
              </Animated.Text>
            )}
          </LayoutAnimationConfig>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);
TabItem.displayName = "TabItem";

export default function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isCompact = width < 360;
  const iconSize = isCompact ? 28 : 35;

  const handleTabPress = useCallback(
    (routeKey: string, routeName: string, isFocused: boolean) => {
      const event = navigation.emit({
        type: "tabPress",
        target: routeKey,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        try {
          Haptics.selectionAsync();
        } catch {
          // Haptics fallback
        }
        navigation.navigate(routeName);
      }
    },
    [navigation]
  );

  const handleTabLongPress = useCallback(
    (routeKey: string) => {
      navigation.emit({
        type: "tabLongPress",
        target: routeKey,
      });
    },
    [navigation]
  );

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, isCompact ? 6 : 10),
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          isCompact && styles.containerCompact,
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const routeMeta = ROUTE_ICON_MAP[route.name] || {
            active: icons.home.active,
            inactive: icons.home.inactive,
            defaultTitle: route.name,
          };

          const label =
            options.tabBarLabel !== undefined &&
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : routeMeta.defaultTitle;

          return (
            <TabItem
              key={route.key}
              routeKey={route.key}
              routeName={route.name}
              isFocused={isFocused}
              label={label}
              iconActive={routeMeta.active}
              iconInactive={routeMeta.inactive}
              iconSize={iconSize}
              isCompact={isCompact}
              onPress={() => handleTabPress(route.key, route.name, isFocused)}
              onLongPress={() => handleTabLongPress(route.key)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    height: 64,
    width: "92%",
    maxWidth: 440,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  containerCompact: {
    height: 56,
    width: "96%",
    paddingHorizontal: 4,
    borderRadius: 22,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  pillActive: {
    backgroundColor: "rgba(235, 92, 73, 0.12)",
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  pillInactive: {
    backgroundColor: "transparent",
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  pillCompact: {
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  pillActiveCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    color: "#EB5C49",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  labelCompact: {
    fontSize: 10.5,
    marginLeft: 4,
  },
});
