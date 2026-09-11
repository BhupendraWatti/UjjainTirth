import React, { useEffect, useRef, useState } from "react";
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
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { requestPhoneNumberHint } from "@/services/otpAutofill";
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
  const hasTriggeredRef = useRef(false);
  const hasRequestedHintRef = useRef(false);

  useEffect(() => {
    if (initialPhone || hasRequestedHintRef.current) return;
    hasRequestedHintRef.current = true;

    requestPhoneNumberHint().then((selectedPhone) => {
      if (!selectedPhone) return;
      const numeric = selectedPhone.replace(/\D/g, "").slice(-10);
      setPhoneNumber(numeric);
      if (numeric.length === 10 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onSendOtp(numeric);
      }
    });
  }, [initialPhone, onSendOtp]);

  useEffect(() => {
    if (errorMessage) {
      hasTriggeredRef.current = false;
    }
  }, [errorMessage]);

  useEffect(() => {
    const numeric = initialPhone.replace(/\D/g, "").slice(0, 10);
    if (numeric.length === 10 && !loading && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onSendOtp(numeric);
    }
  }, [initialPhone]);

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
      if (!loading && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onSendOtp(numeric);
      }
    } else {
      hasTriggeredRef.current = false;
    }
  };

  const handlePressSend = () => {
    if (!isValid || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    hasTriggeredRef.current = true;
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
                <TrishulLogo size={34} color={COLORS.gold} />
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
                    placeholderTextColor={COLORS.inkFaint}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    returnKeyType="done"
                    onSubmitEditing={handlePressSend}
                    autoComplete="tel"
                    textContentType="telephoneNumber"
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
                    <Ionicons name="alert-circle" size={16} color={COLORS.error} />
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
                        ? [COLORS.primary, COLORS.primaryDeep]
                        : [COLORS.primary + "99", COLORS.primaryDeep + "99"]
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
                    <Ionicons name="shield-checkmark-outline" size={19} color={COLORS.gold} />
                  </View>
                  <Text style={styles.trustTitle}>{"Secure"}</Text>
                  <Text style={styles.trustSubtitle}>{"& Private"}</Text>
                </View>

                <View style={styles.trustDivider} />

                {/* Badge 2: Quick Verification */}
                <View style={styles.trustItem}>
                  <View style={styles.trustIconCircle}>
                    <Ionicons name="flash-outline" size={19} color={COLORS.gold} />
                  </View>
                  <Text style={styles.trustTitle}>{"Quick"}</Text>
                  <Text style={styles.trustSubtitle}>{"Verification"}</Text>
                </View>

                <View style={styles.trustDivider} />

                {/* Badge 3: Account Auto Created */}
                <View style={styles.trustItem}>
                  <View style={styles.trustIconCircle}>
                    <Ionicons name="people-outline" size={19} color={COLORS.gold} />
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
    backgroundColor: COLORS.bg,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.55,
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
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 1.4,
  },
  divineSubText: {
    fontSize: 9.5,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkMuted,
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
    backgroundColor: COLORS.hairline,
  },
  ornamentDiamond: {
    fontSize: 8,
    color: COLORS.gold,
    marginHorizontal: 6,
  },
  middleSpacer: {
    flex: 1,
    minHeight: 30,
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
    fontFamily: FONTS.display.bold,
    color: COLORS.ink,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  mainHeadingAccent: {
    fontSize: 28,
    fontFamily: FONTS.display.bold,
    color: COLORS.sacred,
    letterSpacing: -0.5,
    textAlign: "center",
    marginTop: -3,
  },
  subHeading: {
    fontSize: 13.5,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.hairline,
    height: 54,
    paddingHorizontal: 14,
    ...SHADOWS.subtle,
  },
  phoneInputRowValid: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.surface,
  },
  countryCodeBox: {
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 17,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    letterSpacing: 0.5,
  },
  inputDivider: {
    width: 1.2,
    height: 24,
    backgroundColor: COLORS.hairline,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.ink,
    letterSpacing: 1,
    paddingVertical: 0,
  },
  verifiedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
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
    fontFamily: FONTS.body.medium,
    color: COLORS.error,
  },
  ctaButtonWrapper: {
    width: "100%",
    marginTop: 14,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.card,
  },
  ctaButtonDisabled: {
    shadowOpacity: 0.1,
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
    fontFamily: FONTS.body.bold,
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
    backgroundColor: COLORS.bgStone,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  trustTitle: {
    fontSize: 11.5,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    textAlign: "center",
  },
  trustSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    marginTop: 1,
  },
  trustDivider: {
    width: 1,
    height: 34,
    backgroundColor: COLORS.hairline,
  },
  footerSpacing: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});
