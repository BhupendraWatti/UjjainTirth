import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface TextInputFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine keyboard and input traits based on field type and name
  let keyboardType: KeyboardTypeOptions = "default";
  let autoCapitalize: "none" | "sentences" | "words" | "characters" = "sentences";
  let iconName: keyof typeof Ionicons.glyphMap = "pencil-outline";

  if (field.type === "email") {
    keyboardType = "email-address";
    autoCapitalize = "none";
    iconName = "mail-outline";
  } else if (field.type === "tel") {
    keyboardType = "phone-pad";
    autoCapitalize = "none";
    iconName = "call-outline";
  } else if (field.type === "number") {
    keyboardType = "numeric";
    autoCapitalize = "none";
    iconName = "calculator-outline";
  } else {
    // Contextual icon based on field name
    const lowerName = field.name.toLowerCase();
    if (lowerName.includes("name")) {
      iconName = "person-outline";
      autoCapitalize = "words";
    } else if (lowerName.includes("city")) {
      iconName = "location-outline";
      autoCapitalize = "words";
    } else if (lowerName.includes("budget") || lowerName.includes("cost") || lowerName.includes("price")) {
      iconName = "wallet-outline";
      keyboardType = "numeric";
      autoCapitalize = "none";
    }
  }

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
        <Ionicons
          name={iconName}
          size={18}
          color={
            hasError
              ? COLORS.error
              : isFocused
              ? COLORS.primary
              : COLORS.inkFaint
          }
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            field.placeholder ||
            `Enter ${field.label.replace(/\*+$/, "").trim().toLowerCase()}`
          }
          placeholderTextColor={COLORS.inkFaint}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1.2,
    borderColor: "rgba(43, 36, 32, 0.12)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 52,
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
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14.5,
    fontFamily: FONTS.body.medium,
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
