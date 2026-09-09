import { API_ENDPOINTS, API_GRANTH_URL, DEFAULT_HEADERS } from "@/constants/api";
import { clearStoredUser, getStoredUser, setStoredUser, StoredUser } from "@/utils/storage";

export interface SendOtpResponse {
  success: boolean;
  message: string;
  cooldown?: number;
  isMock?: boolean;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  userId?: number;
  redirectUrl?: string;
  isMock?: boolean;
}

export interface UserProfileInput {
  name: string;
  gender: "Male" | "Female" | "Other" | string;
  city: string;
}

/**
 * Format any mobile input to E.164 (+91 standard for India)
 */
export function formatPhoneNumber(mobile: string): string {
  const cleaned = mobile.replace(/[^\d+]/g, "").trim();
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

/**
 * Request OTP for mobile number.
 * Note: Granth Bulk SMS requires a non-empty customer_name in live API.
 * We provide "Yatri" as default to keep the initial phone input lightning-fast.
 */
export async function sendOtp(
  mobileNumber: string,
  customerName = "Yatri"
): Promise<SendOtpResponse> {
  const cleanMobile = formatPhoneNumber(mobileNumber);

  try {
    const url = `${API_GRANTH_URL}${API_ENDPOINTS.SEND_OTP}`;
    const response = await fetch(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        mobile_number: cleanMobile,
        customer_name: customerName,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "OTP sent successfully to your mobile number.",
        cooldown: data.cooldown ?? 60,
      };
    }

    // Handle case where DLT Template ID is missing on WordPress
    if (__DEV__ && data.message && data.message.includes("DLT Template ID")) {
      console.warn(
        "[authService] WordPress SMS Gateway error: DLT Template ID not set. Providing Dev OTP (123456)."
      );
      return {
        success: true,
        message: "Development Mode: SMS DLT template missing in WP. Use OTP 123456 to test.",
        cooldown: 60,
        isMock: true,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to send OTP. Please check your number.",
      cooldown: data.cooldown,
    };
  } catch (error) {
    console.error("[authService] sendOtp error:", error);
    if (__DEV__) {
      return {
        success: true,
        message: "Dev offline mode: Use OTP 123456 to test.",
        cooldown: 60,
        isMock: true,
      };
    }
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Resend OTP to the given mobile number.
 */
export async function resendOtp(
  mobileNumber: string,
  customerName = "Yatri"
): Promise<SendOtpResponse> {
  const cleanMobile = formatPhoneNumber(mobileNumber);

  try {
    const url = `${API_GRANTH_URL}${API_ENDPOINTS.RESEND_OTP}`;
    const response = await fetch(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        mobile_number: cleanMobile,
        customer_name: customerName,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "OTP resent successfully.",
        cooldown: data.cooldown ?? 60,
      };
    }

    if (__DEV__ && data.message && data.message.includes("DLT Template ID")) {
      return {
        success: true,
        message: "Dev Mode: Use OTP 123456.",
        cooldown: 60,
        isMock: true,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to resend OTP.",
      cooldown: data.cooldown,
    };
  } catch (error) {
    console.error("[authService] resendOtp error:", error);
    return {
      success: false,
      message: "Network error while resending OTP.",
    };
  }
}

/**
 * Verify OTP entered by user.
 */
export async function verifyOtp(
  mobileNumber: string,
  otpCode: string
): Promise<VerifyOtpResponse> {
  const cleanMobile = formatPhoneNumber(mobileNumber);
  const trimmedOtp = otpCode.trim();

  // Support dev test code if in __DEV__ and DLT template isn't live
  if (__DEV__ && trimmedOtp === "123456") {
    const devUser: StoredUser = {
      id: 99999,
      mobile: cleanMobile,
      name: "Pilgrim Yatri",
      isLoggedIn: true,
    };
    await setStoredUser(devUser);

    return {
      success: true,
      message: "Development verification successful.",
      userId: devUser.id,
      isMock: true,
    };
  }

  try {
    const url = `${API_GRANTH_URL}${API_ENDPOINTS.VERIFY_OTP}`;
    const response = await fetch(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        mobile_number: cleanMobile,
        otp_code: trimmedOtp,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const userId = data.user_id ?? 1;
      const user: StoredUser = {
        id: userId,
        mobile: cleanMobile,
        name: "Yatri",
        isLoggedIn: true,
      };
      await setStoredUser(user);

      return {
        success: true,
        message: data.message || "OTP verified successfully.",
        userId: userId,
        redirectUrl: data.redirect_url,
      };
    }

    return {
      success: false,
      message: data.message || "Invalid or expired OTP. Please try again.",
    };
  } catch (error) {
    console.error("[authService] verifyOtp error:", error);
    return {
      success: false,
      message: "Verification failed due to a network issue.",
    };
  }
}

/**
 * Save user profile details (Name, Gender, City) after OTP verification.
 */
export async function saveUserProfile(
  profile: UserProfileInput
): Promise<{ success: boolean; message: string }> {
  try {
    const current = await getStoredUser();
    if (!current) {
      return { success: false, message: "No active user session found." };
    }

    const updatedUser: StoredUser = {
      ...current,
      name: profile.name.trim(),
      gender: profile.gender,
      city: profile.city.trim(),
    };

    await setStoredUser(updatedUser);
    return { success: true, message: "Profile saved successfully." };
  } catch (error) {
    console.error("[authService] saveUserProfile error:", error);
    return { success: false, message: "Failed to save profile." };
  }
}

/**
 * Log out user by clearing storage session.
 */
export async function logoutUser(): Promise<void> {
  await clearStoredUser();
}
