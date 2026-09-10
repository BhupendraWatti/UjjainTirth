import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  LotusBlessingMotif,
  TempleSkylineArt,
  TrishulLogo,
} from "./SacredArtwork";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DEFAULT_SCREEN_1_IMAGE =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Ujjain-sacred-skyline-1.png";

interface LoginViewProps {
  onSendOtp: (phoneNumber: string) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
  initialPhone?: string;
  dynamicImageUrl?: string;
}

export default function LoginView({
  onSendOtp,
  loading,
  errorMessage,
  initialPhone = "",
  dynamicImageUrl,
}: LoginViewProps) {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const phoneInputRef = useRef<TextInput | null>(null);

  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const isValid = cleanPhone.length === 10;

  const handlePhoneChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(numeric);
    if (numeric.length === 10) {
      Keyboard.dismiss();
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics fallback
      }
    }
  };

  const handlePressSend = () => {
    if (!isValid || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    onSendOtp(cleanPhone);
  };

  const heroSourceUrl = dynamicImageUrl || DEFAULT_SCREEN_1_IMAGE;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* ── Full-Screen Sacred Background Artwork (Post ID 5675) with minimized opacity ── */}
        {!imageLoadFailed && (
          <Image
            source={{ uri: heroSourceUrl }}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={() => setImageLoadFailed(true)}
          />
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom + 12, 20) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Fallback Artwork if dynamic image fails to load */}
            {imageLoadFailed && (
              <View style={styles.artworkFallbackWindow}>
                <TrishulLogo size={34} color="#C47D2B" />
                <TempleSkylineArt width={Math.min(SCREEN_WIDTH - 24, 380)} height={160} />
              </View>
            )}

            {/* ── Flexible Middle Window ── */}
            {/* The sacred golden Trishul, glowing sun with Om, and holy temples shine through cleanly */}
            <View style={styles.middleSpacer} />

            {/* ── Bottom Section (Anchored to Bottom) ── */}
            <View style={styles.bottomSection}>
              {/* Sacred Tagline Ribbon Banner */}
              <View style={styles.divineTagRow}>
                <Text style={styles.divineHindiText}>
                  {"आस्था  •  दर्शन  •  सेवा  •  उज्जैन"}
                </Text>
                <Text style={styles.divineSubText}>{"A DIVINE JOURNEY AWAITS"}</Text>
                <View style={styles.ornamentDivider}>
                  <View style={styles.ornamentLine} />
                  <Text style={styles.ornamentDiamond}>{"◆"}</Text>
                  <View style={styles.ornamentLine} />
                </View>
              </View>

              {/* Heading & Subtitle: Directly above the input box */}
              <View style={styles.headingSection}>
                <Text style={styles.mainHeading}>{"Let's Begin"}</Text>
                <Text style={styles.mainHeadingAccent}>{"Your Yatra"}</Text>
                <Text style={styles.subHeading}>
                  {"Enter your mobile number to receive a secure verification code"}
                </Text>
              </View>

              {/* Floating Phone Input & Send OTP CTA */}
              <View style={styles.inputSection}>
                <View style={[styles.phoneInputRow, isValid && styles.phoneInputRowValid]}>
                  {/* +91 Country Badge */}
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.countryCodeText}>{"+91"}</Text>
                  </View>
                  <View style={styles.inputDivider} />

                  {/* Number Input Field */}
                  <TextInput
                    ref={phoneInputRef}
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor="#948B7E"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    returnKeyType="done"
                    onSubmitEditing={handlePressSend}
                  />

                  {/* Green Verified Circle Checkmark */}
                  {isValid && (
                    <View style={styles.verifiedCircle}>
                      <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                {/* Error Message */}
                {errorMessage && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#C83232" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                {/* Primary "Send OTP" Button */}
                <TouchableOpacity
                  style={[styles.ctaButtonWrapper, !isValid && styles.ctaButtonDisabled]}
                  onPress={handlePressSend}
                  disabled={!isValid || loading}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={
                      isValid
                        ? ["#0B4D36", "#11674A", "#0E563C"]
                        : ["#3D6B57", "#345C4B", "#2D5242"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaButtonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <View style={styles.ctaContentRow}>
                        <Text style={styles.ctaText}>{"Send OTP"}</Text>
                        <View style={styles.ctaArrowCircle}>
                          <Ionicons name="arrow-forward" size={17} color="#FFF" />
                        </View>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* 3-Feature Trust Badges */}
              <View style={styles.trustBadgesRow}>
                {/* Badge 1: Secure */}
                <View style={styles.trustItem}>
                  <View style={styles.trustIconCircle}>
                    <Ionicons name="shield-checkmark-outline" size={19} color="#C47D2B" />
                  </View>
                  <Text style={styles.trustTitle}>{"Secure"}</Text>
                  <Text style={styles.trustSubtitle}>{"& Private"}</Text>
                </View>

                <View style={styles.trustDivider} />

                {/* Badge 2: Quick Verification */}
                <View style={styles.trustItem}>
                  <View style={styles.trustIconCircle}>
                    <Ionicons name="flash-outline" size={19} color="#C47D2B" />
                  </View>
                  <Text style={styles.trustTitle}>{"Quick"}</Text>
                  <Text style={styles.trustSubtitle}>{"Verification"}</Text>
                </View>

                <View style={styles.trustDivider} />

                {/* Badge 3: Account Auto Created */}
                <View style={styles.trustItem}>
                  <View style={styles.trustIconCircle}>
                    <Ionicons name="people-outline" size={19} color="#C47D2B" />
                  </View>
                  <Text style={styles.trustTitle}>{"Your Account"}</Text>
                  <Text style={styles.trustSubtitle}>{"Created Automatically"}</Text>
                </View>
              </View>

              {/* Bottom Lotus Blessing Motif */}
              <View style={styles.footerSpacing}>
                <LotusBlessingMotif text="Har Yatra Mein Mahakal Ka Saath" />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4ECE0", // Matches warm holy parchment
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.55, // Minimized opacity for subtle holy watermark effect
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 22,
    alignItems: "center",
  },
  artworkFallbackWindow: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  divineTagRow: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4,
  },
  divineHindiText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8E551A",
    letterSpacing: 1.4,
  },
  divineSubText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#6A5E50",
    letterSpacing: 2,
    marginTop: 2,
  },
  ornamentDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    width: 140,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DFD2BC",
  },
  ornamentDiamond: {
    fontSize: 8,
    color: "#C47D2B",
    marginHorizontal: 6,
  },
  middleSpacer: {
    flex: 1,
    minHeight: 30, // Responsive breathing space showcasing temple skyline and sun
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  headingSection: {
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B201D",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
  },
  mainHeadingAccent: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B201D",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
    marginTop: -3,
  },
  subHeading: {
    fontSize: 13.5,
    color: "#5A5348",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 295,
  },
  inputSection: {
    width: "100%",
    alignItems: "center",
  },
  phoneInputRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#DFD5BF",
    height: 54,
    paddingHorizontal: 14,
    shadowColor: "#806132",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  phoneInputRowValid: {
    borderColor: "#18865F",
    backgroundColor: "#F8FCFA",
  },
  countryCodeBox: {
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2320",
    letterSpacing: 0.5,
  },
  inputDivider: {
    width: 1.2,
    height: 24,
    backgroundColor: "#DED6C1",
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2320",
    letterSpacing: 1,
    paddingVertical: 0,
  },
  verifiedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#118055",
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
    alignSelf: "flex-start",
  },
  errorText: {
    fontSize: 12.5,
    color: "#C83232",
    fontWeight: "500",
  },
  ctaButtonWrapper: {
    width: "100%",
    marginTop: 14,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#0C4F38",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonDisabled: {
    shadowOpacity: 0.15,
    elevation: 1,
  },
  ctaButtonGradient: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  ctaContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  ctaArrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  trustBadgesRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    paddingHorizontal: 4,
  },
  trustItem: {
    flex: 1,
    alignItems: "center",
  },
  trustIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F6EDE0",
    borderWidth: 1,
    borderColor: "#EADBCA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  trustTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#2C2822",
    textAlign: "center",
  },
  trustSubtitle: {
    fontSize: 10,
    color: "#746E65",
    textAlign: "center",
    marginTop: 1,
  },
  trustDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#DFD3BC",
  },
  footerSpacing: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});
