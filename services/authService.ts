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

export interface OtpSettingsResponse {
  success: boolean;
  otp_length: number;
  otp_expiry_minutes: number;
  otp_template: string;
  otp_dlt_template_id: string;
}

/**
 * Native fetch wrapper with request timeout protection (Expo data fetching standard)
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 12000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new Error("The server took too long to respond. Please try again.");
    }
    throw err;
  }
}

/**
 * Fetch live dynamic OTP settings & template directly from WordPress backend.
 */
export async function fetchOtpSettings(): Promise<OtpSettingsResponse | null> {
  try {
    const url = `${API_GRANTH_URL}${API_ENDPOINTS.OTP_SETTINGS}`;
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    }, 6000);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.warn("[authService] fetchOtpSettings error:", error);
    return null;
  }
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
 * Request OTP for mobile number directly from WordPress backend.
 */
export async function sendOtp(
  mobileNumber: string,
  customerName = "Yatri"
): Promise<SendOtpResponse> {
  const cleanMobile = formatPhoneNumber(mobileNumber);

  try {
    const url = `${API_GRANTH_URL}${API_ENDPOINTS.SEND_OTP}`;
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        mobile_number: cleanMobile,
        customer_name: customerName,
      }),
    }, 12000);

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "OTP sent successfully to your mobile number.",
        cooldown: data.cooldown ?? 60,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to send OTP. Please check your number.",
      cooldown: data.cooldown,
    };
  } catch (error: any) {
    console.error("[authService] sendOtp error:", error);
    return {
      success: false,
      message: error?.message || "Network error. Please check your connection and try again.",
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
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        mobile_number: cleanMobile,
        customer_name: customerName,
      }),
    }, 12000);

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "OTP resent successfully.",
        cooldown: data.cooldown ?? 60,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to resend OTP.",
      cooldown: data.cooldown,
    };
  } catch (error: any) {
    console.error("[authService] resendOtp error:", error);
    return {
      success: false,
      message: error?.message || "Network error while resending OTP.",
    };
  }
}

/**
 * Verify OTP entered by user via live WordPress REST API.
 */
export async function verifyOtp(
  mobileNumber: string,
  otpCode: string
): Promise<VerifyOtpResponse> {
  const cleanMobile = formatPhoneNumber(mobileNumber);
  const trimmedOtp = otpCode.trim();

  try {
    const url = `${API_GRANTH_URL}${API_ENDPOINTS.VERIFY_OTP}`;
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        mobile_number: cleanMobile,
        otp_code: trimmedOtp,
      }),
    }, 10000);

    const data = await response.json();

    if (response.ok && data.success) {
      const userId = data.user_id ?? 1;
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
      message: error instanceof Error ? error.message : "Verification failed due to a network issue.",
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
