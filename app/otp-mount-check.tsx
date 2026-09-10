import React, { useEffect, useState } from "react";
import OtpVerificationView from "@/components/auth/OtpVerificationView";

export default function OtpMountCheck() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      setLoading(value => !value);
      if (++count === 12) {
        clearInterval(timer);
        console.log("OTP_MOUNT_CHECK completed 12 loading transitions");
      }
    }, 350);
    return () => clearInterval(timer);
  }, []);
  return <OtpVerificationView phoneNumber="" loading={loading} errorMessage={null}
    cooldownSeconds={60} onVerifyOtp={async () => false}
    onResendOtp={async () => {}} onBack={() => {}} />;
}
