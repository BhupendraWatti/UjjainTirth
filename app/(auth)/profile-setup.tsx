import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";

type GenderOption = "Male" | "Female" | "Other";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mobile?: string }>();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<GenderOption>("Male");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayMobile = params.mobile || user?.mobile || "";

  const handleSkip = () => {
    Keyboard.dismiss();
    router.replace("/(tabs)");
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      setError("Please enter your name to personalize your yatra experience.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        name: name.trim(),
        gender: gender,
        city: city.trim(),
      });
      router.replace("/(tabs)");
    } catch {
      setError("Unable to save details right now. You can skip and proceed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header with prominent Skip */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Personalize Pilgrimage</Text>
          <TouchableOpacity style={styles.skipHeaderBtn} onPress={handleSkip}>
            <Text style={styles.skipHeaderText}>Skip</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card */}
          <View style={styles.introCard}>
            <View style={styles.iconBadge}>
              <Ionicons name="sparkles" size={24} color="#FFF" />
            </View>
            <Text style={styles.introTitle}>Jay Mahakal! Welcome</Text>
            <Text style={styles.introSubtitle}>
              Please tell us a little about yourself so we can curate your temple darshans and pooja bookings.
            </Text>
          </View>

          {/* Tabular Form Section */}
          <View style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderTitle}>PILGRIM DETAILS</Text>
              <Text style={styles.optionalBadge}>Optional</Text>
            </View>

            {/* Row 1: Verified Mobile */}
            <View style={styles.tableRow}>
              <View style={styles.rowLabelCol}>
                <Ionicons name="call-outline" size={18} color={COLORS.inkMuted} />
                <Text style={styles.rowLabel}>Mobile</Text>
              </View>
              <View style={styles.rowValueCol}>
                <Text style={styles.verifiedPhone}>{displayMobile || "Verified"}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 2: Name */}
            <View style={styles.tableRow}>
              <View style={styles.rowLabelCol}>
                <Ionicons name="person-outline" size={18} color={COLORS.inkMuted} />
                <Text style={styles.rowLabel}>Full Name</Text>
              </View>
              <View style={styles.rowValueCol}>
                <TextInput
                  style={styles.tableInput}
                  placeholder="e.g. Ramesh Sharma"
                  placeholderTextColor={COLORS.inkFaint}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    setError(null);
                  }}
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 3: Gender (Tabular Segmented Tabs) */}
            <View style={[styles.tableRow, { alignItems: "flex-start", paddingVertical: 14 }]}>
              <View style={[styles.rowLabelCol, { paddingTop: 6 }]}>
                <Ionicons name="transgender-outline" size={18} color={COLORS.inkMuted} />
                <Text style={styles.rowLabel}>Gender</Text>
              </View>
              <View style={styles.genderTabsContainer}>
                {(["Male", "Female", "Other"] as GenderOption[]).map((opt) => {
                  const isSelected = gender === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.genderPill,
                        isSelected ? styles.genderPillActive : null,
                      ]}
                      onPress={() => setGender(opt)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          isSelected ? styles.genderTextActive : null,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 4: Home City / Address */}
            <View style={styles.tableRow}>
              <View style={styles.rowLabelCol}>
                <Ionicons name="location-outline" size={18} color={COLORS.inkMuted} />
                <Text style={styles.rowLabel}>City / Town</Text>
              </View>
              <View style={styles.rowValueCol}>
                <TextInput
                  style={styles.tableInput}
                  placeholder="e.g. Indore, Bhopal, Delhi"
                  placeholderTextColor={COLORS.inkFaint}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>
          </View>

          {error && <Text style={styles.errorBanner}>{error}</Text>}

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.saveBtnText}>Complete & Continue</Text>
                <Ionicons name="checkmark-sharp" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipSecondaryBtn}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipSecondaryText}>I&apos;ll do this later (Skip)</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },
  skipHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  skipHeaderText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  introCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 20,
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOWS.subtle,
  },
  introTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  tableCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  tableHeaderTitle: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    letterSpacing: 1,
    color: COLORS.inkMuted,
  },
  optionalBadge: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkMuted,
    backgroundColor: COLORS.bgStone,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  rowLabelCol: {
    flexDirection: "row",
    alignItems: "center",
    width: 110,
    gap: 8,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkBody,
  },
  rowValueCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verifiedPhone: {
    fontSize: 15,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.ink,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.success,
  },
  tableInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.body.regular,
    color: COLORS.ink,
    paddingVertical: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.hairline,
    marginLeft: 18,
  },
  genderTabsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.hairline,
    backgroundColor: COLORS.bgStone,
    alignItems: "center",
    justifyContent: "center",
  },
  genderPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryTint,
  },
  genderText: {
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
  },
  genderTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.body.bold,
  },
  errorBanner: {
    color: COLORS.error,
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    textAlign: "center",
    marginTop: 8,
  },
  saveBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    ...SHADOWS.subtle,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: FONTS.body.bold,
  },
  skipSecondaryBtn: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  skipSecondaryText: {
    fontSize: 14,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkMuted,
  },
});
