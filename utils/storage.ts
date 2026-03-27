import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_done";

export const setOnboardingDone = async () => {
  try {
    // await AsyncStorage.setItem(ONBOARDING_KEY, "true");
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
