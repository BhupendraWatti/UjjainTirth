import { DynamicFieldRenderer } from "@/components/forms/DynamicFieldRenderer";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { usePackageFormSchema, usePackageFormSubmit } from "@/hooks/usePackageForm";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

interface DynamicPackageFormProps {
  showHeader?: boolean;
  onSuccess?: () => void;
}

export const DynamicPackageForm: React.FC<DynamicPackageFormProps> = ({
  showHeader = true,
  onSuccess,
}) => {
  // 1. Fetch Dynamic Schema via React Query
  const { schema, loading, error, reload } = usePackageFormSchema();
  const { submit, isSubmitting } = usePackageFormSubmit();

  // 2. Form State: Dynamic key-value pairs keyed by field.name
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [lastSubmittedInfo, setLastSubmittedInfo] = useState<any>(null);

  // Field value handler
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear field-level error on interaction
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });

    if (serverError) {
      setServerError(null);
    }
  }, [serverError]);

  // Client-side dynamic validation
  const validateForm = useCallback((): boolean => {
    if (!schema?.fields) return false;

    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    schema.fields.forEach((field: FormField) => {
      const val = formValues[field.name];
      const trimmedVal = typeof val === "string" ? val.trim() : val;
      const isEmpty =
        val === undefined ||
        val === null ||
        trimmedVal === "" ||
        (Array.isArray(val) && val.length === 0);

      // Dynamic Required check
      if (field.required && isEmpty) {
        errors[field.name] = `${field.label.replace(/\*+$/, "").trim()} is required.`;
        return;
      }

      // Dynamic Email check
      if (field.type === "email" && !isEmpty) {
        if (!emailRegex.test(String(trimmedVal))) {
          errors[field.name] = "Please enter a valid email address.";
          return;
        }
      }

      // Dynamic Phone check
      if (field.type === "tel" && !isEmpty) {
        const digits = String(trimmedVal).replace(/\D/g, "");
        if (digits.length < 10) {
          errors[field.name] = "Please enter a valid 10-digit mobile number.";
          return;
        }
      }
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return false;
    }

    return true;
  }, [formValues, schema]);

  // Handle Form Submission
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setServerError(null);

    // Validate fields dynamically
    const isValid = validateForm();
    if (!isValid) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      // Submit dynamically collected values
      const res = await submit(formValues);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      // Record success details
      setLastSubmittedInfo(res);
      setIsSuccessState(true);

      // Reset form values on confirmed success
      setFormValues({});
      setFieldErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});

      // Map server validation error back to field if provided
      if (err?.field) {
        setFieldErrors((prev) => ({
          ...prev,
          [err.field]: err.message,
        }));
      }

      setServerError(err?.message || "Could not submit enquiry. Please try again.");
    }
  };

  const handleReset = () => {
    setIsSuccessState(false);
    setServerError(null);
    setFieldErrors({});
    setFormValues({});
  };

  // Group fields into logical sections if helpful
  const renderedFields = useMemo(() => {
    if (!schema?.fields) return [];
    return schema.fields;
  }, [schema]);

  // Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingTitle}>Loading Sacred Package Form...</Text>
        <Text style={styles.loadingSubtitle}>
          Fetching latest enquiry configuration from Ujjain Tirth
        </Text>
      </View>
    );
  }

  // Error State
  if (error || !schema) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIconWrap}>
          <Ionicons name="cloud-offline-outline" size={40} color={COLORS.error} />
        </View>
        <Text style={styles.errorTitle}>Unable to Load Form</Text>
        <Text style={styles.errorSubtitle}>
          {error || "Form schema is currently unavailable. Please check your internet connection."}
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => reload()}>
          <Ionicons name="refresh" size={18} color={COLORS.white} />
          <Text style={styles.retryBtnText}>Retry Loading</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Success Confirmation View
  if (isSuccessState) {
    return (
      <ScrollView
        contentContainerStyle={styles.successScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <View style={styles.successIconWrapper}>
            <Ionicons name="checkmark-circle" size={54} color={COLORS.success} />
          </View>

          <Text style={styles.successTitle}>Enquiry Received!</Text>
          <Text style={styles.successBlessing}>
            "जय श्री महाकाल • Har Har Mahadev"
          </Text>

          <Text style={styles.successMessage}>
            {lastSubmittedInfo?.message ||
              "Your package customization enquiry has been registered with our Ujjain pilgrimage team."}
          </Text>

          <View style={styles.successInfoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Our pilgrimage coordinator will review your itinerary and contact you shortly.
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Direct support: +91 91791 87199 (Mon - Sun, 8 AM - 9 PM)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.anotherBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.anotherBtnText}>Submit Another Enquiry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Dynamic Form View
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Editorial Header */}
        {showHeader && (
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{schema.title || "My Package & My Cost"}</Text>
              <View style={styles.headerFlourish}>
                <Svg width={36} height={12} viewBox="0 0 36 12" fill="none">
                  <Line x1="0" y1="6" x2="12" y2="6" stroke="#C99A55" strokeWidth="1" strokeDasharray="2 2" />
                  <Path d="M 18 1 C 16 4 16 8 18 11 C 20 8 20 4 18 1 Z" fill="#C99A55" />
                  <Circle cx="18" cy="6" r="1.5" fill="#FAF4EA" />
                  <Line x1="24" y1="6" x2="36" y2="6" stroke="#C99A55" strokeWidth="1" strokeDasharray="2 2" />
                </Svg>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>
              Customize your Ujjain pilgrimage, temple darshan, and stay with transparent estimates.
            </Text>
          </View>
        )}

        {/* Sacred Trust Guarantee Card */}
        <View style={styles.trustBanner}>
          <View style={styles.trustRow}>
            <Ionicons name="ribbon-outline" size={18} color={COLORS.gold} />
            <Text style={styles.trustText}>
              Verified Pandit Ji • Genuine Yatra Advice • Zero Hidden Costs
            </Text>
          </View>
        </View>

        {/* Global Server Error Alert */}
        {serverError && (
          <View style={styles.serverErrorBox}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.serverErrorText}>{serverError}</Text>
          </View>
        )}

        {/* Dynamic Fields Container */}
        <View style={styles.formCard}>
          {renderedFields.map((field) => (
            <DynamicFieldRenderer
              key={field.name}
              field={field}
              value={formValues[field.name]}
              onChange={(val) => handleFieldChange(field.name, val)}
              error={fieldErrors[field.name]}
              disabled={isSubmitting}
            />
          ))}

          {/* Primary Submit CTA Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityLabel="Submit Package Enquiry"
          >
            {isSubmitting ? (
              <View style={styles.submittingRow}>
                <ActivityIndicator size="small" color={COLORS.white} />
                <Text style={styles.submitButtonText}>Submitting Enquiry...</Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <Text style={styles.submitButtonText}>Request Package & Cost</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Our team responds within 2 hours with customized darshan options.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  headerContainer: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: 0.2,
  },
  headerFlourish: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginTop: 4,
    lineHeight: 19,
  },
  trustBanner: {
    backgroundColor: "#FBF7EF",
    borderWidth: 1,
    borderColor: "rgba(184, 128, 46, 0.25)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.gold,
  },
  serverErrorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF2F2",
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
  },
  serverErrorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: COLORS.error,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.08)",
    ...SHADOWS.card,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    ...SHADOWS.subtle,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submittingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 15.5,
    fontFamily: FONTS.body.bold,
    letterSpacing: 0.2,
  },
  footerNote: {
    fontSize: 11.5,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkFaint,
    textAlign: "center",
    marginTop: 12,
  },

  // State Containers
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loadingTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginTop: 14,
  },
  loadingSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    marginTop: 4,
  },
  errorIconWrap: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.full,
    backgroundColor: "#FDF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  retryBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.body.bold,
  },

  // Success Card View
  successScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.08)",
    ...SHADOWS.elevated,
  },
  successIconWrapper: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    textAlign: "center",
  },
  successBlessing: {
    fontSize: 14,
    fontFamily: FONTS.display.regular,
    color: COLORS.sacred,
    marginTop: 4,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  successInfoBox: {
    width: "100%",
    backgroundColor: "#F8F5EE",
    borderRadius: RADIUS.md,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
    lineHeight: 18,
  },
  anotherBtn: {
    backgroundColor: COLORS.primaryTint,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  anotherBtnText: {
    color: COLORS.primary,
    fontSize: 14.5,
    fontFamily: FONTS.body.bold,
  },
});

export default DynamicPackageForm;
