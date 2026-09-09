import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_done";
const AUTH_USER_KEY = "@ujjaintirth_auth_user";

export interface StoredUser {
  id: number;
  mobile: string;
  name?: string;
  gender?: "Male" | "Female" | "Other" | string;
  city?: string;
  isLoggedIn: boolean;
  token?: string;
}

export const setOnboardingDone = async () => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (e) {
    console.log("Storage error:", e);
  }
};

export const isOnboardingDone = async () => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch (e) {
    console.log("Storage error:", e);
    return false;
  }
};

export const getStoredUser = async (): Promise<StoredUser | null> => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.log("Error getting stored user:", e);
    return null;
  }
};

export const setStoredUser = async (user: StoredUser): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.log("Error setting stored user:", e);
  }
};

export const clearStoredUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    console.log("Error clearing stored user:", e);
  }
};
