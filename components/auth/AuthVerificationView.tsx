import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { resendOtp, sendOtp, verifyOtp } from "@/services/authService";
import { fetchOtpScreens } from "@/services/otpScreenService";
import { useAuth } from "@/context/AuthContext";
import { startOtpAutofill } from "@/services/otpAutofill";
import { COLORS } from "@/constants/colors";
import LoginView from "./LoginView";
import OtpVerificationView from "./OtpVerificationView";

interface AuthVerificationViewProps {
  onSuccess?: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export default function AuthVerificationView({
  onSuccess,
}: AuthVerificationViewProps) {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Dynamic OTP Screen Images from WordPress API
  // Screen 1: Post ID 5675
  // Screen 2: Post IDs 5676 (Panorama), 5678 (Left Mandala), 5680 (Right Mandala), 5682 (Center Ohm)
  const [screen1ImageUrl, setScreen1ImageUrl] = useState<string | undefined>(undefined);
  const [screen2PanoramaUrl, setScreen2PanoramaUrl] = useState<string | undefined>(undefined);
  const [screen2LeftMandalaUrl, setScreen2LeftMandalaUrl] = useState<string | undefined>(undefined);
  const [screen2RightMandalaUrl, setScreen2RightMandalaUrl] = useState<string | undefined>(undefined);
  const [screen2CenterOhmUrl, setScreen2CenterOhmUrl] = useState<string | undefined>(undefined);
  const [screen2CenterChakraUrl, setScreen2CenterChakraUrl] = useState<string | undefined>(undefined);
  const [detectedOtp, setDetectedOtp] = useState("");
  const stopOtpAutofillRef = useRef<() => void>(() => {});
  const verificationPendingRef = useRef(false);
  const verifiedRef = useRef(false);

  const listenForOtp = useCallback(async () => {
    stopOtpAutofillRef.current();
    setDetectedOtp("");
    stopOtpAutofillRef.current = await startOtpAutofill(setDetectedOtp);
  }, []);

  useEffect(() => () => stopOtpAutofillRef.current(), []);

  useEffect(() => {
    let isMounted = true;
    fetchOtpScreens().then((data) => {
      if (isMounted) {
        setScreen1ImageUrl(data.screen1ImageUrl);
        setScreen2PanoramaUrl(data.screen2PanoramaUrl);
        setScreen2LeftMandalaUrl(data.screen2LeftMandalaUrl);
        setScreen2RightMandalaUrl(data.screen2RightMandalaUrl);
        setScreen2CenterOhmUrl(data.screen2CenterOhmUrl);
        setScreen2CenterChakraUrl(data.screen2CenterChakraUrl);
      }
    });
    return () => {
      isMounted = false;
    };
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

  // Step 1: Send OTP via live backend with optimistic screen transition
  const handleSendOtp = async (phone: string) => {
    const raw = phone.replace(/\D/g, "");
    if (raw.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setPhoneNumber(raw);
    setStep("otp");
    setLoading(true);
    setErrorMessage(null);

    try {
      await listenForOtp();
      const res = await sendOtp(raw, "Yatri");
      if (res && res.success) {
        setCooldown(res.cooldown || 60);
      } else {
        setStep("phone");
        setErrorMessage(res.message || "Failed to send OTP. Please check your number.");
      }
    } catch (e: any) {
      setStep("phone");
      setErrorMessage(e?.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP via live WordPress backend
  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    if (!/^\d{6}$/.test(code) || verificationPendingRef.current || verifiedRef.current) return false;
    verificationPendingRef.current = true;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await verifyOtp(phoneNumber, code);
      if (res.success) {
        const fullNumber = phoneNumber.startsWith("+91")
          ? phoneNumber
          : `+91${phoneNumber}`;

        await login({
          id: res.userId || 1,
          mobile: fullNumber,
          isLoggedIn: true,
        });

        verifiedRef.current = true;
        stopOtpAutofillRef.current();
        navigateAfterVerification();
        return true;
      } else {
        setErrorMessage(res.message || "Invalid OTP. Please check and try again.");
        return false;
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Verification failed. Please check your network.");
      return false;
    } finally {
      verificationPendingRef.current = false;
      setLoading(false);
    }
  };

  // Navigate immediately after the verified session has been saved.
  const navigateAfterVerification = () => {
    try {
      if (Keyboard && typeof Keyboard.dismiss === "function") {
        Keyboard.dismiss();
      }
    } catch {
      // Safe fallback
    }
    if (onSuccess) {
      onSuccess();
    } else {
      router.replace("/(auth)/onboarding");
    }
  };

  // Step 4: Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      await listenForOtp();
      const res = await resendOtp(phoneNumber, "Yatri");
      if (res.success) {
        setCooldown(res.cooldown || 60);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Failed to resend OTP. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {step === "phone" ? (
        <LoginView
          onSendOtp={handleSendOtp}
          loading={loading}
          errorMessage={errorMessage}
          initialPhone={phoneNumber}
          dynamicImageUrl={screen1ImageUrl}
        />
      ) : (
        <OtpVerificationView
          phoneNumber={phoneNumber}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          onBack={() => {
            setStep("phone");
            setErrorMessage(null);
          }}
          loading={loading}
          errorMessage={errorMessage}
          cooldownSeconds={cooldown}
          bottomImageUrl={screen2PanoramaUrl}
          leftMandalaUrl={screen2LeftMandalaUrl}
          rightMandalaUrl={screen2RightMandalaUrl}
          centerOhmUrl={screen2CenterOhmUrl}
          centerChakraUrl={screen2CenterChakraUrl}
          autoFillCode={detectedOtp}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
