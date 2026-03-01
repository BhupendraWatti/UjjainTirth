import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function Intro() {
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([Animated.timing(logoOpacity, {toValue: 1,duration: 1200,useNativeDriver: true,}),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
      <Animated.Image
        source={require("../assets/images/ujjain_tirth_logo.png")}
        style={{ width: 160, height: 160, opacity: logoOpacity }}
        resizeMode="contain"
      />

      <Animated.View style={{ opacity: buttonOpacity, marginTop: 40 }}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: "#000",
            paddingVertical: 14,
            paddingHorizontal: 50,
            borderRadius: 0,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}