import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface TextareaFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{field.label.replace(/\*+$/, "").trim()}</Text>
        {field.required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            field.placeholder ||
            `Enter details or special preferences...`
          }
          placeholderTextColor={COLORS.inkFaint}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!disabled}
          accessibilityLabel={field.label}
        />
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
    marginBottom: 7,
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
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.2,
    borderColor: "rgba(43, 36, 32, 0.12)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 104,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFFDFB",
    borderWidth: 1.5,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
    backgroundColor: "#FFF9F9",
  },
  inputWrapperDisabled: {
    backgroundColor: COLORS.surfaceMuted,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
    lineHeight: 21,
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
