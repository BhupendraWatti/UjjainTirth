import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface SelectFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options = field.options || [];

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  const handleSelect = (val: string) => {
    onChange(val);
    setModalVisible(false);
  };

  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{field.label.replace(/\*+$/, "").trim()}</Text>
        {field.required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        style={[
          styles.inputWrapper,
          hasError && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        <Ionicons
          name="options-outline"
          size={18}
          color={hasError ? COLORS.error : value ? COLORS.primary : COLORS.inkFaint}
          style={styles.icon}
        />
        <Text
          style={[
            styles.valueText,
            !value && styles.placeholderText,
          ]}
        >
          {displayLabel || field.placeholder || `Choose ${field.label.replace(/\*+$/, "").trim()}`}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.inkFaint} />
      </TouchableOpacity>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Options Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>
                      Select {field.label.replace(/\*+$/, "").trim()}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      Choose an option from the list below
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={20} color={COLORS.inkBody} />
                  </TouchableOpacity>
                </View>

                <View style={styles.optionsList}>
                  {options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        activeOpacity={0.7}
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionItemSelected,
                        ]}
                        onPress={() => handleSelect(opt.value)}
                      >
                        <View style={styles.optionTextRow}>
                          <View
                            style={[
                              styles.radioIndicator,
                              isSelected && styles.radioIndicatorSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioDot} />}
                          </View>
                          <Text
                            style={[
                              styles.optionLabel,
                              isSelected && styles.optionLabelSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color={COLORS.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  valueText: {
    flex: 1,
    fontSize: 14.5,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
  },
  placeholderText: {
    color: COLORS.inkFaint,
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

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: 20,
    paddingBottom: 36,
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },
  modalSubtitle: {
    fontSize: 12.5,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.2,
    borderColor: "rgba(43, 36, 32, 0.06)",
  },
  optionItemSelected: {
    backgroundColor: COLORS.primaryTint,
    borderColor: COLORS.primary,
  },
  optionTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioIndicator: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    borderWidth: 1.8,
    borderColor: COLORS.inkFaint,
    justifyContent: "center",
    alignItems: "center",
  },
  radioIndicatorSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: 14.5,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
  },
  optionLabelSelected: {
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
});
