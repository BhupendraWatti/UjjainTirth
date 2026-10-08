import * as SecureStore from "expo-secure-store";

const BOOKING_TOKEN_KEY = "ujjaintirth_booking_token";

export async function getBookingToken(): Promise<string | null> {
  return SecureStore.getItemAsync(BOOKING_TOKEN_KEY);
}

export async function setBookingToken(token: string | null): Promise<void> {
  if (token) {
    await SecureStore.setItemAsync(BOOKING_TOKEN_KEY, token);
    return;
  }
  await SecureStore.deleteItemAsync(BOOKING_TOKEN_KEY);
}

export async function clearBookingToken(): Promise<void> {
  await SecureStore.deleteItemAsync(BOOKING_TOKEN_KEY);
}
