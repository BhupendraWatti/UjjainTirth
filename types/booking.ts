export interface BookingRecord {
  reference: string;
  type: string;
  customer_name: string;
  arrival_date: string | null;
  accommodation: string | null;
  budget: string | null;
  hotel_name: string | null;
  total_price: string | null;
  advance_payment: string | null;
  remaining_balance: string | null;
  payment_mode: string | null;
  vehicle_id: number | null;
  vehicle_name: string | null;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NOT_INTERESTED";
  status_label: string;
  created_at: string;
  updated_at: string;
}

export interface MyBookingsResponse {
  bookings: BookingRecord[];
}
