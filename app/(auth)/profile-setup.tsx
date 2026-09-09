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
                <Ionicons name="call-outline" size={18} color="#777" />
                <Text style={styles.rowLabel}>Mobile</Text>
              </View>
              <View style={styles.rowValueCol}>
                <Text style={styles.verifiedPhone}>{displayMobile || "Verified"}</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>

            <View style={styles.rowDivider} />

            {/* Row 2: Name */}
            <View style={styles.tableRow}>
              <View style={styles.rowLabelCol}>
                <Ionicons name="person-outline" size={18} color="#777" />
                <Text style={styles.rowLabel}>Full Name</Text>
              </View>
              <View style={styles.rowValueCol}>
                <TextInput
                  style={styles.tableInput}
                  placeholder="e.g. Ramesh Sharma"
                  placeholderTextColor="#AAA"
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
                <Ionicons name="transgender-outline" size={18} color="#777" />
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
                <Ionicons name="location-outline" size={18} color="#777" />
                <Text style={styles.rowLabel}>City / Town</Text>
              </View>
              <View style={styles.rowValueCol}>
                <TextInput
                  style={styles.tableInput}
                  placeholder="e.g. Indore, Bhopal, Delhi"
                  placeholderTextColor="#AAA"
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
    backgroundColor: "#F5EFE7",
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
    fontWeight: "700",
    color: COLORS.textDark,
  },
  skipHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  skipHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 8,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBE1",
  },
  tableHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#888",
  },
  optionalBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    backgroundColor: "#F5F0E8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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
    fontWeight: "600",
    color: "#555",
  },
  rowValueCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verifiedPhone: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2E7D32",
  },
  tableInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    paddingVertical: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F4EFE6",
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
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E6DEC8",
    backgroundColor: "#FCFAF7",
    alignItems: "center",
    justifyContent: "center",
  },
  genderPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#FDE8E5",
  },
  genderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  genderTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  errorBanner: {
    color: "#D9383A",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
  saveBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  skipSecondaryBtn: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  skipSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
  },
});
