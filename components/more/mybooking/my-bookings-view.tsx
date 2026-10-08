import ScreenContainer from "@/components/layout/ScreenContainer";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { useBookings } from "@/hooks/use-bookings";
import { BookingAuthenticationError } from "@/services/booking-service";
import { BookingRecord } from "@/types/booking";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const STATUS_COLORS: Record<BookingRecord["status"], { background: string; text: string }> = {
  NEW: { background: COLORS.primaryTint, text: COLORS.primaryDeep },
  CONTACTED: { background: "#FFF1CC", text: "#8A5A00" },
  CONFIRMED: { background: "#E5F4E7", text: COLORS.success },
  COMPLETED: { background: COLORS.journeyTint, text: COLORS.journey },
  CANCELLED: { background: "#F4E7E5", text: COLORS.error },
  NOT_INTERESTED: { background: COLORS.surfaceMuted, text: COLORS.inkMuted },
};

const money = (value: string | null) => value === null ? "Not fixed" : `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function BookingCard({ booking }: { booking: BookingRecord }) {
  const status = STATUS_COLORS[booking.status] ?? STATUS_COLORS.NEW;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.reference}>{booking.reference}</Text>
          <Text style={styles.created}>Enquired {booking.created_at.slice(0, 10)}</Text>
        </View>
        <View style={[styles.status, { backgroundColor: status.background }]}>
          <Text style={[styles.statusText, { color: status.text }]}>{booking.status_label}</Text>
        </View>
      </View>

      <View style={styles.divider} />
      <View style={styles.detailRow}><Ionicons name="calendar-outline" size={18} color={COLORS.gold} /><Text style={styles.detailText}>Arrival: {booking.arrival_date || "To be decided"}</Text></View>
      <View style={styles.detailRow}><Ionicons name="bed-outline" size={18} color={COLORS.gold} /><Text style={styles.detailText}>Stay preference: {booking.accommodation || "Not selected"} · Budget: {booking.budget || "Not provided"}</Text></View>
      <View style={styles.detailRow}><Ionicons name="business-outline" size={18} color={COLORS.sacred} /><Text style={styles.detailText}>Hotel: {booking.hotel_name || "Our team is finalising it"}</Text></View>
      <View style={styles.detailRow}><Ionicons name="car-outline" size={18} color={COLORS.journey} /><Text style={styles.detailText}>Vehicle: {booking.vehicle_name || "Our team is finalising it"}</Text></View>

      {booking.total_price !== null && (
        <View style={styles.paymentBox}>
          <View><Text style={styles.paymentLabel}>Total</Text><Text style={styles.paymentValue}>{money(booking.total_price)}</Text></View>
          <View><Text style={styles.paymentLabel}>Advance</Text><Text style={styles.paymentValue}>{money(booking.advance_payment)}</Text></View>
          <View><Text style={styles.paymentLabel}>Balance</Text><Text style={styles.paymentValue}>{money(booking.remaining_balance)}</Text></View>
        </View>
      )}
      {booking.payment_mode && <Text style={styles.paymentMode}>Payment mode: {booking.payment_mode}</Text>}
    </View>
  );
}

export default function MyBookingsView() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const query = useBookings(isAuthenticated ? user?.id : undefined);

  const header = (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
      </Pressable>
      <View><Text style={styles.title}>My Bookings</Text><Text style={styles.subtitle}>Your private Ujjain travel records</Text></View>
    </View>
  );

  if (authLoading || (isAuthenticated && Boolean(user?.id) && query.isLoading)) {
    return <ScreenContainer noPadding>{header}<View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.stateText}>Loading your bookings…</Text></View></ScreenContainer>;
  }

  if (!isAuthenticated || !user?.id || query.error instanceof BookingAuthenticationError) {
    return <ScreenContainer noPadding>{header}<View style={styles.center}><Ionicons name="lock-closed-outline" size={52} color={COLORS.sacred} /><Text style={styles.stateTitle}>Secure sign-in required</Text><Text style={styles.stateText}>Verify your mobile number again to connect your private booking records.</Text><Pressable style={styles.primaryButton} onPress={() => router.push("/(auth)/login")}><Text style={styles.primaryButtonText}>Sign in with OTP</Text></Pressable></View></ScreenContainer>;
  }

  if (query.error) {
    return <ScreenContainer noPadding>{header}<View style={styles.center}><Ionicons name="cloud-offline-outline" size={52} color={COLORS.error} /><Text style={styles.stateTitle}>Could not load bookings</Text><Text style={styles.stateText}>{query.error.message}</Text><Pressable style={styles.primaryButton} onPress={() => query.refetch()}><Text style={styles.primaryButtonText}>Try again</Text></Pressable></View></ScreenContainer>;
  }

  return (
    <ScreenContainer noPadding>
      {header}
      <FlatList
        data={query.data?.bookings ?? []}
        keyExtractor={(item) => item.reference}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={query.isFetching} onRefresh={query.refetch} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        ListEmptyComponent={<View style={styles.center}><Ionicons name="calendar-outline" size={52} color={COLORS.gold} /><Text style={styles.stateTitle}>No bookings yet</Text><Text style={styles.stateText}>Your package enquiries and confirmed travel records will appear here.</Text><Pressable style={styles.primaryButton} onPress={() => router.push("/packages/form")}><Text style={styles.primaryButtonText}>Plan a pilgrimage</Text></Pressable></View>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.hairline, backgroundColor: COLORS.bg },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface },
  title: { fontFamily: FONTS.display.semiBold, fontSize: 23, color: COLORS.ink },
  subtitle: { fontFamily: FONTS.body.regular, fontSize: 12, color: COLORS.inkMuted, marginTop: 2 },
  list: { padding: 16, paddingBottom: 40, flexGrow: 1, gap: 14 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.hairline, padding: 17, ...SHADOWS.card },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  reference: { fontFamily: FONTS.body.bold, fontSize: 15, color: COLORS.ink },
  created: { fontFamily: FONTS.body.regular, fontSize: 11.5, color: COLORS.inkMuted, marginTop: 3 },
  status: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { fontFamily: FONTS.body.bold, fontSize: 11 },
  divider: { height: 1, backgroundColor: COLORS.hairline, marginVertical: 14 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 10 },
  detailText: { flex: 1, fontFamily: FONTS.body.medium, fontSize: 13, color: COLORS.inkBody },
  paymentBox: { flexDirection: "row", justifyContent: "space-between", backgroundColor: COLORS.surfaceMuted, borderRadius: RADIUS.md, padding: 12, marginTop: 4 },
  paymentLabel: { fontFamily: FONTS.body.regular, fontSize: 10.5, color: COLORS.inkMuted },
  paymentValue: { fontFamily: FONTS.body.bold, fontSize: 12.5, color: COLORS.ink, marginTop: 2 },
  paymentMode: { fontFamily: FONTS.body.regular, fontSize: 11.5, color: COLORS.inkMuted, marginTop: 9 },
  center: { flex: 1, minHeight: 360, alignItems: "center", justifyContent: "center", paddingHorizontal: 34 },
  stateTitle: { fontFamily: FONTS.display.semiBold, fontSize: 20, color: COLORS.ink, marginTop: 14, textAlign: "center" },
  stateText: { fontFamily: FONTS.body.regular, fontSize: 13.5, lineHeight: 21, color: COLORS.inkMuted, marginTop: 7, textAlign: "center" },
  primaryButton: { minHeight: 48, justifyContent: "center", backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 22, marginTop: 20, ...SHADOWS.subtle },
  primaryButtonText: { fontFamily: FONTS.body.bold, fontSize: 14, color: COLORS.white },
});
