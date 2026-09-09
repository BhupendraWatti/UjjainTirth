import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { resendOtp, sendOtp, verifyOtp } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { setOnboardingDone } from "@/utils/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SlideItem {
  id: string;
  tag: string;
  line1: string;
  line2: string;
  image: any;
}

const CAROUSEL_SLIDES: SlideItem[] = [
  {
    id: "1",
    tag: "Divine Darshan",
    line1: "Darshan,",
    line2: "Blessed at every step",
    image: { uri: "https://ujjaintirth.com/wp-content/uploads/2026/03/1.png" },
  },
  {
    id: "2",
    tag: "Vedic Rituals",
    line1: "Sacred Puja,",
    line2: "Performed with devotion",
    image: { uri: "https://ujjaintirth.com/wp-content/uploads/2026/03/2.jpeg" },
  },
  {
    id: "3",
    tag: "Holy Yatra",
    line1: "Peaceful Stay,",
    line2: "Near Mahakal Temple",
    image: { uri: "https://ujjaintirth.com/wp-content/uploads/2026/03/3.png" },
  },
];

// Suggested phone numbers for Google Phone Hint selector (Screenshot 1)
const SUGGESTED_PHONE_NUMBERS = [
  { id: "1", number: "7723030628", display: "917723030628" },
  { id: "2", number: "6261200968", display: "916261200968" },
];

interface AuthVerificationViewProps {
  onSuccess?: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export default function AuthVerificationView({
  onSuccess,
  onSkip,
  showSkip = true,
}: AuthVerificationViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  // Step state
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Google Phone Selector sheet state (Screenshot 1)
  const [showGoogleHint, setShowGoogleHint] = useState(true);

  // Carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const slideScrollX = useRef(new Animated.Value(0)).current;
  const slideFlatListRef = useRef<any>(null);

  // Animations
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const hintSheetAnim = useRef(new Animated.Value(0)).current;
  const otpInputRef = useRef<TextInput | null>(null);
  const phoneInputRef = useRef<TextInput | null>(null);

  // Auto advance carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % CAROUSEL_SLIDES.length;
        slideFlatListRef.current?.scrollToOffset({
          offset: next * SCREEN_WIDTH,
          animated: true,
        });
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    let timer: any = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  // Trigger floating "OTP Sent" toast
  const triggerOtpSentToast = useCallback(() => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: insets.top + 10,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2800),
      Animated.timing(toastAnim, {
        toValue: -80,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  }, [insets.top, toastAnim]);

  // Handle Google Phone Number selection (Screenshot 1)
  const handleSelectGoogleNumber = (number: string) => {
    setShowGoogleHint(false);
    setPhoneNumber(number);
    setErrorMessage(null);
  };

  // Close Google Phone Hint (user wants to manually type)
  const handleCloseGoogleHint = () => {
    setShowGoogleHint(false);
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 200);
  };

  // Handle Skip
  const handleSkip = async () => {
    Keyboard.dismiss();
    await setOnboardingDone();
    if (onSkip) {
      onSkip();
    } else {
      router.replace("/(tabs)");
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (overrideNumber?: string) => {
    const target = overrideNumber || phoneNumber;
    const raw = target.replace(/\D/g, "");
    if (raw.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await sendOtp(raw, "Yatri");
      if (res.success) {
        setCooldown(res.cooldown || 60);
        triggerOtpSentToast();

        // Switch sheet to OTP verification
        setStep("otp");
        setOtpCode("");
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 350);
      } else {
        setErrorMessage(res.message);
        if (res.cooldown) {
          setCooldown(res.cooldown);
        }
      }
    } catch {
      setErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Input (Single Master Input for 100% Android SMS Autofill)
  const handleOtpChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    setOtpCode(cleaned);
    setErrorMessage(null);

    // Auto-verify as soon as 6th digit arrives (e.g. from SMS autofill or keyboard within 3 seconds)
    if (cleaned.length === 6) {
      Keyboard.dismiss();
      submitVerification(cleaned);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await resendOtp(phoneNumber, "Yatri");
      if (res.success) {
        setCooldown(res.cooldown || 60);
        triggerOtpSentToast();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Failed to resend OTP. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP Verification
  const submitVerification = async (code: string) => {
    if (code.length !== 6) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await verifyOtp(phoneNumber, code);
      if (res.success) {
        await login({
          id: res.userId || 1,
          mobile: phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`,
          isLoggedIn: true,
        });

        await setOnboardingDone();

        if (onSuccess) {
          onSuccess();
        } else {
          router.replace({
            pathname: "/(auth)/profile-setup" as any,
            params: { mobile: phoneNumber },
          });
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = phoneNumber.replace(/\D/g, "").length === 10;
  const isOtpFilled = otpCode.length === 6;

  // Split OTP string into 6 display characters
  const otpDigits = [
    otpCode[0] || "",
    otpCode[1] || "",
    otpCode[2] || "",
    otpCode[3] || "",
    otpCode[4] || "",
    otpCode[5] || "",
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* ── Background Hero Image & Carousel ── */}
        <View style={styles.heroBackground}>
          <Animated.FlatList
            ref={slideFlatListRef}
            data={CAROUSEL_SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: slideScrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveSlide(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.slideContainer}>
                <Image
                  source={item.image}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />

                {/* Hero Headline Text */}
                <View style={[styles.headlineContainer, { top: insets.top + 70 }]}>
                  <Text style={styles.heroTitleLine1}>{item.line1}</Text>
                  <Text style={styles.heroTitleLine2}>{item.line2}</Text>
                </View>
              </View>
            )}
          />

          <Text style={[styles.floatingStar, { top: insets.top + 60, right: 36 }]}>
            ✦
          </Text>
          <Text style={[styles.floatingStarSmall, { top: insets.top + 170, left: 24 }]}>
            ✦
          </Text>
        </View>

        {/* ── Top Bar: Logo, Pagination Dots, Skip ── */}
        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <View style={styles.logoRow}>
            <Image
              source={require("@/assets/images/ujjain_tirth_logo.png")}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandTitle}>UjjainTirth</Text>
              <Text style={styles.brandSubtitle}>ॐ नमः शिवाय</Text>
            </View>
          </View>

          <View style={styles.dotsRow}>
            {CAROUSEL_SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activeSlide ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          {showSkip ? (
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        {/* ── Floating "✓ OTP Sent" Toast Banner (Screenshot 3) ── */}
        {showToast && (
          <Animated.View
            style={[
              styles.otpSentToast,
              { transform: [{ translateY: toastAnim }] },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.otpSentToastText}>OTP Sent</Text>
          </Animated.View>
        )}

        {/* ── Google "Choose a phone number" Sheet Overlay (Screenshot 1) ── */}
        {showGoogleHint && step === "phone" && (
          <View style={styles.googleHintOverlay}>
            <View style={styles.googleHintSheet}>
              {/* Header */}
              <View style={styles.googleHeaderRow}>
                <View style={styles.googleIconCircle}>
                  {/* Google G Icon with authentic colors */}
                  <Text style={styles.googleLetter}>G</Text>
                </View>
                <TouchableOpacity
                  style={styles.googleCloseBtn}
                  onPress={handleCloseGoogleHint}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={22} color="#444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.googleSheetTitle}>Choose a phone number</Text>
              <Text style={styles.googleSheetSubtitle}>
                You can choose a phone number that&apos;s assigned to your phone, and Google will share it only with this app.
              </Text>
              <Text style={styles.googleSheetPrivacy}>
                Google won&apos;t store the phone number you share with this app in your Google account
              </Text>

              {/* Number Option Cards */}
              {SUGGESTED_PHONE_NUMBERS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.googleNumberCard}
                  onPress={() => handleSelectGoogleNumber(item.number)}
                  activeOpacity={0.75}
                >
                  <Ionicons name="call-outline" size={20} color="#333" />
                  <Text style={styles.googleNumberText}>{item.display}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.googleFooterNote}>
                You can update your phone number sharing preference in your{" "}
                <Text style={styles.googleUnderline}>device settings</Text>.
              </Text>
            </View>
          </View>
        )}

        {/* ── Bottom Sheet Auth Card (Screenshots 2 & 3) ── */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={styles.bottomSheetWrapper}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              { paddingBottom: Math.max(insets.bottom + 12, 24) },
            ]}
          >
            {step === "phone" ? (
              /* ── STEP 1: Phone Number Input (Screenshot 2) ── */
              <View>
                <Text style={styles.sheetTitle}>Enter your phone number</Text>
                <Text style={styles.sheetSubtitle}>
                  We&apos;ll send you a verification code to your phone
                </Text>

                {/* Input Container with +91 box */}
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCodeBadge}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    ref={phoneInputRef}
                    style={styles.phoneTextInput}
                    placeholder="Phone number"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(val) => {
                      const cleaned = val.replace(/\D/g, "");
                      setPhoneNumber(cleaned);
                      setErrorMessage(null);
                      if (cleaned.length === 10) {
                        Keyboard.dismiss();
                      }
                    }}
                  />
                </View>

                {errorMessage && (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {/* "Get OTP" Button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isPhoneValid ? styles.actionBtnActive : styles.actionBtnDisabled,
                  ]}
                  onPress={() => handleSendOtp()}
                  disabled={!isPhoneValid || loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.actionBtnText,
                        isPhoneValid
                          ? styles.actionBtnTextActive
                          : styles.actionBtnTextDisabled,
                      ]}
                    >
                      Get OTP
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Legal Disclaimer */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By signing in you agree to our{"\n"}
                    <Text
                      style={styles.termsLink}
                      onPress={() => Linking.openURL("https://ujjaintirth.com/terms")}
                    >
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text
                      style={styles.termsLink}
                      onPress={() => Linking.openURL("https://ujjaintirth.com/privacy-policy")}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View>
            ) : (
              /* ── STEP 2: Verify OTP (Screenshot 3) ── */
              <View>
                {/* Back Arrow */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setStep("phone");
                    setErrorMessage(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>

                <Text style={styles.sheetTitle}>Verify Number</Text>
                <Text style={styles.sheetSubtitle}>
                  OTP sent via SMS
                </Text>

                {/* Phone row with Edit button */}
                <View style={styles.phoneEditRow}>
                  <Text style={styles.phoneDisplay}>+91 {phoneNumber}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setStep("phone");
                      setErrorMessage(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {/* ── Visual 6-Digit OTP Boxes with Hidden Master Input for Instant Android Autofill ── */}
                <View style={styles.otpBoxesWrapper}>
                  {/* Hidden Master TextInput for Native SMS Retriever & Keyboard Autofill */}
                  <TextInput
                    ref={otpInputRef}
                    style={styles.hiddenMasterInput}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otpCode}
                    onChangeText={handleOtpChange}
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    caretHidden
                  />

                  {/* 6 Visual Digit Display Boxes */}
                  <View style={styles.otpBoxesRow} pointerEvents="none">
                    {otpDigits.map((digit, idx) => {
                      const isCurrent = otpCode.length === idx;
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.otpBox,
                            digit ? styles.otpBoxFilled : null,
                            isCurrent ? styles.otpBoxFocused : null,
                            errorMessage ? styles.otpBoxError : null,
                          ]}
                        >
                          <Text style={styles.otpBoxText}>{digit}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Resend in 60s / Resend link */}
                <View style={styles.resendRow}>
                  {cooldown > 0 ? (
                    <Text style={styles.resendTimerText}>
                      Resend in {cooldown}s
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleResendOtp}
                      disabled={loading}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.resendActiveLink}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {errorMessage && (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {/* "Verify" Button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isOtpFilled ? styles.actionBtnActive : styles.actionBtnDisabled,
                  ]}
                  onPress={() => submitVerification(otpCode)}
                  disabled={!isOtpFilled || loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.actionBtnText,
                        isOtpFilled
                          ? styles.actionBtnTextActive
                          : styles.actionBtnTextDisabled,
                      ]}
                    >
                      Verify
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Legal Disclaimer */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By signing in you agree to our{"\n"}
                    <Text
                      style={styles.termsLink}
                      onPress={() => Linking.openURL("https://ujjaintirth.com/terms")}
                    >
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text
                      style={styles.termsLink}
                      onPress={() => Linking.openURL("https://ujjaintirth.com/privacy-policy")}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  heroBackground: {
    flex: 1,
    width: "100%",
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  headlineContainer: {
    position: "absolute",
    left: 24,
    right: 24,
  },
  heroTitleLine1: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2C2C2C",
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  heroTitleLine2: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0E7453",
    letterSpacing: -0.5,
    lineHeight: 40,
    marginTop: 2,
  },
  floatingStar: {
    position: "absolute",
    fontSize: 22,
    color: "#E2A03F",
  },
  floatingStarSmall: {
    position: "absolute",
    fontSize: 16,
    color: "#E2A03F",
  },
  topBar: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandLogo: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E3D34",
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#E0533C",
    letterSpacing: 1,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  dotInactive: {
    width: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  skipBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  otpSentToast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0E7453",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  otpSentToastText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  /* Google Phone Hint Bottom Sheet (Screenshot 1) */
  googleHintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "flex-end",
    zIndex: 998,
  },
  googleHintSheet: {
    backgroundColor: "#F7F6EF", // Light subtle cream tone from screenshot
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  googleHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  googleIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
  },
  googleLetter: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
  },
  googleCloseBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  googleSheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  googleSheetSubtitle: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 6,
  },
  googleSheetPrivacy: {
    fontSize: 12,
    color: "#666",
    lineHeight: 17,
    marginBottom: 16,
  },
  googleNumberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EBEAE2",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  googleNumberText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  googleFooterNote: {
    fontSize: 12,
    color: "#777",
    marginTop: 10,
    lineHeight: 17,
  },
  googleUnderline: {
    color: "#B45309",
    textDecorationLine: "underline",
  },

  /* Bottom Sheet Card (Screenshot 2 & 3) */
  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  backButton: {
    marginBottom: 12,
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.2,
    borderColor: "#E2E2E2",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 14,
  },
  countryCodeBadge: {
    height: "100%",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1.2,
    borderRightColor: "#E2E2E2",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  phoneTextInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  phoneEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  phoneDisplay: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  editLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0E7453",
  },

  /* Master Hidden Input + Visual OTP Boxes */
  otpBoxesWrapper: {
    position: "relative",
    marginVertical: 12,
  },
  hiddenMasterInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.01,
    zIndex: 10,
  },
  otpBoxesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E2E2",
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFilled: {
    borderColor: "#0E7453",
    backgroundColor: "#F5FBF8",
  },
  otpBoxFocused: {
    borderColor: "#0E7453",
    borderWidth: 2,
  },
  otpBoxError: {
    borderColor: "#D9383A",
  },
  otpBoxText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  resendRow: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 14,
  },
  resendTimerText: {
    fontSize: 13,
    color: "#777",
    fontWeight: "500",
  },
  resendActiveLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0E7453",
  },
  errorText: {
    color: "#D9383A",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
  actionBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  actionBtnDisabled: {
    backgroundColor: "#EFEFEF",
  },
  actionBtnActive: {
    backgroundColor: "#0E7453",
    shadowColor: "#0E7453",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  actionBtnTextDisabled: {
    color: "#B0B0B0",
  },
  actionBtnTextActive: {
    color: "#FFFFFF",
  },
  termsContainer: {
    marginTop: 14,
    alignItems: "center",
  },
  termsText: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    lineHeight: 16,
  },
  termsLink: {
    color: "#555",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
