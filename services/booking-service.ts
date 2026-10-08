import { API_ENDPOINTS, API_UTBM_URL } from "@/constants/api";
import { getBookingToken } from "@/services/booking-session";
import { MyBookingsResponse } from "@/types/booking";

export class BookingAuthenticationError extends Error {}

export async function fetchMyBookings(): Promise<MyBookingsResponse> {
  const token = await getBookingToken();
  if (!token) {
    throw new BookingAuthenticationError("Sign in again to securely view your bookings.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_UTBM_URL}${API_ENDPOINTS.MY_BOOKINGS}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-UTBM-Booking-Token": token,
      },
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (response.status === 401 || response.status === 403) {
      throw new BookingAuthenticationError(data?.message || "Your booking session has expired. Sign in again.");
    }
    if (!response.ok || !Array.isArray(data?.bookings)) {
      throw new Error(data?.message || "Bookings could not be loaded right now.");
    }
    return { bookings: data.bookings };
  } catch (error) {
    if (error instanceof BookingAuthenticationError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The booking service took too long to respond. Please try again.");
    }
    throw error instanceof Error ? error : new Error("Bookings could not be loaded right now.");
  } finally {
    clearTimeout(timeout);
  }
}
