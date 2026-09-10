import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import OnboardingView from "@/components/onboarding/OnboardingView";
import { JaiMahakalDivider, TempleSkylineArt, TrishulLogo } from "./SacredArtwork";

const { width: SW, height: SH } = Dimensions.get("window");
const CHAKRA_FALLBACK =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Golden-Om-Mandala-Medallion-1.png";

// Transition speed configuration:
// Set to true for demo/testing (~4.5s total)
// Set to false for production (~1.8s total)
const IS_DEMO_TIMING = true;

type AnimState = "waiting" | "otpDetected" | "verifying" | "verified" | "veiling";

interface OtpVerificationViewProps {
  phoneNumber: string;
  onVerifyOtp: (code: string) => Promise<boolean | void>;
  onResendOtp: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
  errorMessage: string | null;
  cooldownSeconds: number;
  bottomImageUrl?: string;
  leftMandalaUrl?: string;
  rightMandalaUrl?: string;
  centerOhmUrl?: string;
  centerChakraUrl?: string;
  isAuthSuccess?: boolean;
  onAnimationFinish?: () => void;
}

export default function OtpVerificationView({
  phoneNumber,
  onVerifyOtp,
  onResendOtp,
  onBack,
  loading,
  errorMessage,
  cooldownSeconds,
  bottomImageUrl,
  centerChakraUrl,
  isAuthSuccess = false,
  onAnimationFinish,
}: OtpVerificationViewProps) {
  const insets = useSafeAreaInsets();
  const [otpCode, setOtpCode] = useState("");
  const [bottomImgFailed, setBottomImgFailed] = useState(false);
  const [animState, setAnimState] = useState<AnimState>("waiting");
  const hasStartedAnimation = useRef(false);
  const inputRef = useRef<TextInput | null>(null);

  // Status & spinner animations
  const spinVal = useRef(new Animated.Value(0)).current;
  const progressVal = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Mandala Veil Reveal animations
  const otpContentOpacity = useRef(new Animated.Value(1)).current;
  const mandalaGlowOpacity = useRef(new Animated.Value(0)).current;
  const mandalaGlowScale = useRef(new Animated.Value(0.95)).current;
  const veilScale = useRef(new Animated.Value(0.4)).current;
  const veilOpacity = useRef(new Animated.Value(0)).current;
  const onboardingOpacity = useRef(new Animated.Value(0)).current;
  const onboardingScale = useRef(new Animated.Value(0.985)).current;

  // Grand enlarged mandala
  const MANDALA = Math.min(SW * 1.15, 450);
  const chakraUrl = centerChakraUrl || CHAKRA_FALLBACK;
  const VEIL_SIZE = Math.max(SW, SH) * 1.6;

  const spin = spinVal.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const progressWidth = progressVal.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  // Rotating sync icon
  useEffect(() => {
    const a = Animated.loop(
      Animated.timing(spinVal, { toValue: 1, duration: 2200, easing: Easing.linear, useNativeDriver: true })
    );
    a.start();
    return () => a.stop();
  }, [spinVal]);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  // OTP entered — trigger card fade-in & verify call
  useEffect(() => {
    if (otpCode.length === 6) {
      Keyboard.dismiss();
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
      setAnimState("otpDetected");
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(progressVal, { toValue: 0.5, duration: 400, useNativeDriver: false }),
      ]).start();
      onVerifyOtp(otpCode);
    } else {
      if (animState !== "waiting") setAnimState("waiting");
      cardOpacity.setValue(0);
      progressVal.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCode]);

  // Loading indicator
  useEffect(() => {
    if (loading && animState === "otpDetected") {
      setAnimState("verifying");
      Animated.timing(progressVal, { toValue: 0.8, duration: 300, useNativeDriver: false }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Error reset
  useEffect(() => {
    if (errorMessage) {
      setAnimState("waiting");
      cardOpacity.setValue(0);
      progressVal.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  // Verified — Mandala Veil Reveal Transition (Calm, Sacred, Premium)
  useEffect(() => {
    if (!isAuthSuccess || hasStartedAnimation.current) return;
    hasStartedAnimation.current = true;
    setAnimState("verified");
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}

    const successDuration = IS_DEMO_TIMING ? 700 : 300;
    const veilExpandDuration = IS_DEMO_TIMING ? 1800 : 700;
    const veilDissolveDuration = IS_DEMO_TIMING ? 1700 : 700;

    // Phase 1 (0.0s – 0.7s): Show success state + subtle warm mandala glow
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(progressVal, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      }),
      Animated.timing(mandalaGlowOpacity, {
        toValue: 0.45, // Subtle warm glow (10–20% visual intensity, never bright)
        duration: 600,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(mandalaGlowScale, {
        toValue: 1.15,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 2 (0.7s – 2.5s): Fade OTP content & expand soft semi-transparent ivory veil from mandala
    const phase2Timer = setTimeout(() => {
      setAnimState("veiling");

      Animated.parallel([
        // Fade OTP foreground content gradually
        Animated.timing(otpContentOpacity, {
          toValue: 0,
          duration: IS_DEMO_TIMING ? 1100 : 450,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),

        // Soft ivory veil expands gently from mandala center without hard edges
        Animated.timing(veilScale, {
          toValue: 2.6,
          duration: veilExpandDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
          useNativeDriver: true,
        }),
        Animated.timing(veilOpacity, {
          toValue: 1.0,
          duration: IS_DEMO_TIMING ? 1400 : 550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, successDuration);

    // Phase 3 (2.5s – 4.2s): Gradually reduce veil opacity to reveal existing Onboarding screen (scale 0.985 -> 1.0)
    const phase3Timer = setTimeout(() => {
      Animated.parallel([
        // Onboarding screen fades in and gently settles from 0.985 to 1.0
        Animated.timing(onboardingOpacity, {
          toValue: 1.0,
          duration: IS_DEMO_TIMING ? 1300 : 550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(onboardingScale, {
          toValue: 1.0,
          duration: veilDissolveDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
          useNativeDriver: true,
        }),

        // Veil gently dissolves
        Animated.timing(veilOpacity, {
          toValue: 0,
          duration: IS_DEMO_TIMING ? 1300 : 550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),

        // Mandala glow gently resolves
        Animated.timing(mandalaGlowOpacity, {
          toValue: 0,
          duration: IS_DEMO_TIMING ? 1000 : 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }, successDuration + veilExpandDuration);

    // Phase 4: Settle & transition callback
    const finishTimer = setTimeout(() => {
      onAnimationFinish?.();
    }, successDuration + veilExpandDuration + (IS_DEMO_TIMING ? 2000 : 800));

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthSuccess]);

  const handleTextChange = (text: string) => {
    setOtpCode(text.replace(/\D/g, "").slice(0, 6));
  };

  const digits = Array.from({ length: 6 }, (_, i) => otpCode[i] ?? "");
  const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91 ${phoneNumber}`;

  // Mandala & OTP Input Row
  const renderMandalaSection = () => (
    <View style={[styles.mandalaSection, { width: SW, height: Math.round(MANDALA * 0.74) }]}>
      {/* Background Mandala: soft, subtle, complete unbroken medallion */}
      <View
        style={[
          styles.mandalaBgWrapper,
          {
            width: MANDALA,
            height: MANDALA,
            left: (SW - MANDALA) / 2,
            top: 0,
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={{ uri: chakraUrl }}
          style={{ width: MANDALA, height: MANDALA, opacity: 0.20 }}
          resizeMode="contain"
        />

        {/* Subtle Warm Glow (10–20% Visual Intensity, never bright) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.mandalaGlowLayer,
            {
              opacity: mandalaGlowOpacity,
              transform: [{ scale: mandalaGlowScale }],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={MANDALA} height={MANDALA} viewBox="0 0 300 300" fill="none">
            <Defs>
              <RadialGradient id="warmMandalaAura" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.6" />
                <Stop offset="35%" stopColor="#FFECC7" stopOpacity="0.35" />
                <Stop offset="70%" stopColor="#F7DFB0" stopOpacity="0.12" />
                <Stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="150" cy="150" r="145" fill="url(#warmMandalaAura)" />
          </Svg>
        </Animated.View>
      </View>

      {/* OTPInputRow: 6 clean boxes positioned over lower portion of mandala (~58% from top) */}
      <View
        style={[
          styles.otpInputRow,
          {
            top: Math.round(MANDALA * 0.58),
          },
        ]}
        pointerEvents={isAuthSuccess ? "none" : "auto"}
      >
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => inputRef.current?.focus()}
          activeOpacity={1}
        >
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otpCode}
            onChangeText={handleTextChange}
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            caretHidden
          />
          <View style={styles.boxesRow}>
            {digits.map((digit, idx) => {
              const isCurrent = !isAuthSuccess && otpCode.length === idx;
              return (
                <View
                  key={idx}
                  style={[
                    styles.digitBox,
                    digit.length > 0 && styles.digitBoxFilled,
                    isCurrent && styles.digitBoxActive,
                    errorMessage != null && styles.digitBoxError,
                  ]}
                >
                  <Text style={styles.digitText}>{digit}</Text>
                  {isCurrent && !digit ? <View style={styles.activeDash} /> : null}
                </View>
              );
            })}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Full Screen OTP Content
  const renderScreenContent = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.contentFlex}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color="#2A241C" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.brandRow}>
              <TrishulLogo size={26} color="#C47D2B" />
              <Text style={styles.brandName}>UjjainTirth</Text>
            </View>
            <Text style={styles.headerMantra}>ॐ नमः शिवाय</Text>
          </View>
          {/* Invisible balance spacer */}
          <View style={{ width: 36 }} />
        </View>

        {/* ── PhoneVerificationTitle ── */}
        <Text style={styles.title}>Verifying Your Number</Text>
        <Text style={styles.subtitle}>We've sent a 6-digit code to</Text>

        {/* Phone number + pencil — inline */}
        <View style={styles.phoneRow}>
          <Text style={styles.phoneText}>{formattedPhone}</Text>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="pencil" size={15} color="#0E7A52" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kav}
        >
          {/* ── Centered Middle Block (Mandala + OTP + Status + Resend) ── */}
          <View style={styles.middleContainer}>
            {/* ── Mandala & OTP Section ── */}
            {renderMandalaSection()}

            {/* ── Status & Verification Area ── */}
            <View style={styles.statusArea}>
              {/* Detecting text */}
              <View style={styles.detectRow}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="sync" size={16} color="#0E5E43" />
                </Animated.View>
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.detectTitle}>Detecting OTP automatically...</Text>
                  <Text style={styles.detectSub}>(Usually within 3 seconds)</Text>
                </View>
              </View>

              {/* Success state: Light green verification card */}
              {(otpCode.length === 6 || animState !== "waiting") && (
                <Animated.View style={[styles.verifiedCard, { opacity: cardOpacity }]}>
                  <View style={styles.verifiedRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#15803D" />
                    <Text style={styles.verifiedText}>
                      {animState === "verified" || animState === "veiling"
                        ? "OTP verified!"
                        : "OTP detected! Verifying…"}
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                  </View>
                </Animated.View>
              )}
            </View>

            {errorMessage ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={15} color="#C83232" />
                <Text style={styles.errorText}> {errorMessage}</Text>
              </View>
            ) : null}

            {/* ── ResendSection: compact centered row ── */}
            <View style={styles.resendRow}>
              <Ionicons name="information-circle-outline" size={15} color="#6E6961" />
              <Text style={styles.resendInfo}>Didn't receive the code?</Text>
              {cooldownSeconds > 0 ? (
                <Text style={styles.resendTimer}>Resend in {cooldownSeconds}s</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                    onResendOtp();
                  }}
                  disabled={loading}
                >
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── UjjainFooterIllustration ── */}
          <View style={styles.footerArea}>
            <View style={styles.footerImgWrapper}>
              {bottomImageUrl && !bottomImgFailed ? (
                <Image
                  source={{ uri: bottomImageUrl }}
                  style={[styles.footerImg, { height: Math.round(SW * 0.35) }]}
                  resizeMode="cover"
                  onError={() => setBottomImgFailed(true)}
                />
              ) : (
                <TempleSkylineArt width={SW} height={Math.round(SW * 0.35)} />
              )}
            </View>
            <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
              <JaiMahakalDivider />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.screenContainer}>
      {/* ── Layer 1: Actual Existing Onboarding Screen Underneath ── */}
      {isAuthSuccess && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.onboardingUnderlay,
            {
              opacity: onboardingOpacity,
              transform: [{ scale: onboardingScale }],
            },
          ]}
          pointerEvents={animState === "veiling" ? "auto" : "none"}
        >
          <OnboardingView />
        </Animated.View>
      )}

      {/* ── Layer 2: Current OTP Screen Content (Fades out gently) ── */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: otpContentOpacity,
          },
        ]}
        pointerEvents={isAuthSuccess ? "none" : "auto"}
      >
        <View style={[styles.screen, { paddingTop: insets.top }]}>
          {renderScreenContent()}
        </View>
      </Animated.View>

      {/* ── Layer 3: Soft Semi-Transparent Ivory Veil (Expands from mandala without hard edge) ── */}
      {isAuthSuccess && (
        <Animated.View
          style={[
            styles.veilWrapper,
            {
              width: VEIL_SIZE,
              height: VEIL_SIZE,
              left: (SW - VEIL_SIZE) / 2,
              top: Math.round(SH * 0.38) - VEIL_SIZE / 2,
              opacity: veilOpacity,
              transform: [{ scale: veilScale }],
            },
          ]}
          pointerEvents="none"
        >
          <Svg width={VEIL_SIZE} height={VEIL_SIZE} viewBox={`0 0 ${VEIL_SIZE} ${VEIL_SIZE}`} fill="none">
            <Defs>
              <RadialGradient id="ivoryVeilGrad" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFFDF6" stopOpacity="0.98" />
                <Stop offset="30%" stopColor="#FAF5EA" stopOpacity="0.95" />
                <Stop offset="60%" stopColor="#F5EFE7" stopOpacity="0.88" />
                <Stop offset="85%" stopColor="#F5EFE7" stopOpacity="0.5" />
                <Stop offset="100%" stopColor="#F5EFE7" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={VEIL_SIZE / 2} cy={VEIL_SIZE / 2} r={VEIL_SIZE / 2} fill="url(#ivoryVeilGrad)" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FAF7F0",
    overflow: "hidden",
  },
  onboardingUnderlay: {
    backgroundColor: "#F5EFE7",
  },
  veilWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  mandalaGlowLayer: {
    alignItems: "center",
    justifyContent: "center",
  },

  screen: { flex: 1, backgroundColor: "#FAF7F0" },
  contentFlex: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E2320",
    letterSpacing: 0.1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  headerMantra: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B27725",
    letterSpacing: 1,
    marginTop: 1,
  },

  // Title
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    letterSpacing: -0.3,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: "#6E6961", textAlign: "center" },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 3,
  },
  phoneText: { fontSize: 14, fontWeight: "700", color: "#1E2320", letterSpacing: 0.3 },

  kav: { flex: 1 },

  // Centered Middle Container (Mandala + OTP + Status + Resend)
  middleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 38,
  },

  // Mandala & OTP Section
  mandalaSection: {
    position: "relative",
    alignItems: "center",
    overflow: "visible",
  },
  mandalaBgWrapper: {
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  // OTP boxes
  otpInputRow: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01,
  },
  boxesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  digitBox: {
    width: 46,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EAD4A2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E29C38",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  digitBoxActive: {
    borderColor: "#C47D2B",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  digitBoxFilled: {
    borderColor: "#DDAE54",
  },
  digitBoxError: {
    borderColor: "#D94242",
    backgroundColor: "#FFF8F8",
  },
  digitText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E2320",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  activeDash: {
    position: "absolute",
    bottom: 9,
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#C47D2B",
  },

  // Status & Verification Card
  statusArea: {
    paddingHorizontal: 24,
    marginTop: 14,
    alignItems: "center",
  },
  detectRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detectTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C2822",
  },
  detectSub: {
    fontSize: 11,
    color: "#7E7569",
    marginTop: 1,
  },
  verifiedCard: {
    width: "100%",
    backgroundColor: "#EAF5EE",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBE6D6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifiedText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#183D29",
    letterSpacing: 0.1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "#D0E8D9",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%" as any,
    backgroundColor: "#16A34A",
    borderRadius: 2,
  },

  // Error
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 12,
    color: "#C83232",
    fontWeight: "500",
  },

  // Resend
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 8,
  },
  resendInfo: {
    fontSize: 12.5,
    color: "#6E6961",
  },
  resendTimer: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#8B704E",
    textDecorationLine: "underline",
  },
  resendLink: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0E5E43",
    textDecorationLine: "underline",
  },

  // Footer
  footerArea: {
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },
  footerImgWrapper: {
    width: SW,
    overflow: "hidden",
    opacity: 0.82,
  },
  footerImg: {
    width: SW,
  },
});
