import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RadioFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const options = field.options || [];
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{field.label.replace(/\*+$/, "").trim()}</Text>
        {field.required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.75}
              disabled={disabled}
              style={[
                styles.optionPill,
                isSelected && styles.optionPillSelected,
                disabled && styles.optionPillDisabled,
              ]}
              onPress={() => onChange(opt.value)}
            >
              <View
                style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleSelected,
                ]}
              >
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13.5,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.ink,
    letterSpacing: 0.1,
  },
  requiredStar: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.error,
    marginLeft: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1.2,
    borderColor: "rgba(43, 36, 32, 0.12)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
    flexGrow: 1,
  },
  optionPillSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryTint,
  },
  optionPillDisabled: {
    opacity: 0.6,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.full,
    borderWidth: 1.8,
    borderColor: COLORS.inkFaint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
  },
  optionTextSelected: {
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.error,
  },
});
