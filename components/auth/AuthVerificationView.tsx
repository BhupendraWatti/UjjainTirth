import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { resendOtp, sendOtp, verifyOtp } from "@/services/authService";
import { fetchOtpScreens } from "@/services/otpScreenService";
import { useAuth } from "@/context/AuthContext";
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
  const [authSuccess, setAuthSuccess] = useState(false);

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

  // Step 1: Send OTP via live backend
  const handleSendOtp = async (phone: string) => {
    const raw = phone.replace(/\D/g, "");
    if (raw.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setPhoneNumber(raw);
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await sendOtp(raw, "Yatri");
      if (res && res.success) {
        setCooldown(res.cooldown || 60);
        setStep("otp");
      } else {
        setErrorMessage(res.message || "Failed to send OTP. Please check your number.");
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP via live WordPress backend
  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    if (code.length !== 6) return false;
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

        setAuthSuccess(true);
        return true;
      } else {
        setErrorMessage(res.message || "Invalid OTP. Please check and try again.");
        return false;
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Verification failed. Please check your network.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Transition to Onboarding after Mandala Veil Reveal completes
  const handleAnimationFinish = () => {
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
            setAuthSuccess(false);
          }}
          loading={loading}
          errorMessage={errorMessage}
          cooldownSeconds={cooldown}
          bottomImageUrl={screen2PanoramaUrl}
          leftMandalaUrl={screen2LeftMandalaUrl}
          rightMandalaUrl={screen2RightMandalaUrl}
          centerOhmUrl={screen2CenterOhmUrl}
          centerChakraUrl={screen2CenterChakraUrl}
          isAuthSuccess={authSuccess}
          onAnimationFinish={handleAnimationFinish}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F0",
  },
});
