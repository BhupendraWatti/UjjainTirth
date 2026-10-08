import { fetchMyBookings, BookingAuthenticationError } from "@/services/booking-service";
import { useQuery } from "@tanstack/react-query";

export function useBookings(userId?: number) {
  return useQuery({
    queryKey: ["my-bookings", userId],
    queryFn: fetchMyBookings,
    enabled: Boolean(userId),
    staleTime: 60_000,
    retry: (count, error) => !(error instanceof BookingAuthenticationError) && count < 2,
  });
}
