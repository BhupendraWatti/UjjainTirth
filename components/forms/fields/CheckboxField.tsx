import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxFieldProps {
  field: FormField;
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  error?: string;
  disabled?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const options = field.options || [];

  // Parse current selected list
  const selectedValues: string[] = Array.isArray(value)
    ? value
    : typeof value === "string" && value.length > 0
    ? value.split(",").map((s) => s.trim())
    : [];

  const handleToggle = (val: string) => {
    let next: string[];
    if (selectedValues.includes(val)) {
      next = selectedValues.filter((v) => v !== val);
    } else {
      next = [...selectedValues, val];
    }

    // If original value was an array or comma-separated string, preserve type
    if (Array.isArray(value)) {
      onChange(next);
    } else {
      onChange(next.join(", "));
    }
  };

  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{field.label.replace(/\*+$/, "").trim()}</Text>
        {field.required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.75}
              disabled={disabled}
              style={[
                styles.optionBox,
                isSelected && styles.optionBoxSelected,
                disabled && styles.optionBoxDisabled,
              ]}
              onPress={() => handleToggle(opt.value)}
            >
              <View
                style={[
                  styles.checkboxSquare,
                  isSelected && styles.checkboxSquareSelected,
                ]}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                )}
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
    gap: 8,
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1.2,
    borderColor: "rgba(43, 36, 32, 0.12)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionBoxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryTint,
  },
  optionBoxDisabled: {
    opacity: 0.6,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.xs,
    borderWidth: 1.8,
    borderColor: COLORS.inkFaint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: COLORS.white,
  },
  checkboxSquareSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
