import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { FormField } from "@/types/form";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface DateFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatDateToISO = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (isoString: string): string => {
  if (!isoString) return "";
  const parts = isoString.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }
  return isoString;
};

export const DateField: React.FC<DateFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Initialize calendar view around currently selected value or today
  const initialDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }, [value]);

  const [viewDate, setViewDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<string>(value || "");

  const openPicker = () => {
    if (disabled) return;
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      setViewDate(new Date(y, m - 1, d));
      setSelectedDate(value);
    } else {
      setViewDate(new Date());
    }
    setModalVisible(true);
  };

  const nextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const now = new Date();
    // Don't allow navigating to past months if already at current month
    if (
      viewDate.getFullYear() > now.getFullYear() ||
      (viewDate.getFullYear() === now.getFullYear() && viewDate.getMonth() > now.getMonth())
    ) {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ day: number | null; iso: string; isPast: boolean }> = [];

    // Blank cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, iso: "", isPast: true });
    }

    const todayStr = formatDateToISO(new Date());

    for (let d = 1; d <= totalDays; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isPast = iso < todayStr;
      days.push({ day: d, iso, isPast });
    }

    return days;
  }, [viewDate]);

  const handleSelectDay = (iso: string) => {
    setSelectedDate(iso);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onChange(selectedDate);
    }
    setModalVisible(false);
  };

  const selectQuickOption = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const iso = formatDateToISO(target);
    setSelectedDate(iso);
    setViewDate(target);
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
        onPress={openPicker}
        disabled={disabled}
        style={[
          styles.inputWrapper,
          hasError && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        <Ionicons
          name="calendar-outline"
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
          {value ? formatDisplayDate(value) : field.placeholder || "Select arrival date"}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.inkFaint} />
      </TouchableOpacity>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Date Picker Modal */}
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
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Choose Arrival Date</Text>
                    <Text style={styles.modalSubtitle}>Select your expected darshan date</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={20} color={COLORS.inkBody} />
                  </TouchableOpacity>
                </View>

                {/* Quick Date Shortcuts */}
                <View style={styles.quickOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.quickOptionPill,
                      selectedDate === formatDateToISO(new Date()) && styles.quickOptionPillActive,
                    ]}
                    onPress={() => selectQuickOption(0)}
                  >
                    <Text
                      style={[
                        styles.quickOptionText,
                        selectedDate === formatDateToISO(new Date()) && styles.quickOptionTextActive,
                      ]}
                    >
                      Today
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.quickOptionPill,
                      selectedDate === formatDateToISO(new Date(Date.now() + 86400000)) &&
                        styles.quickOptionPillActive,
                    ]}
                    onPress={() => selectQuickOption(1)}
                  >
                    <Text
                      style={[
                        styles.quickOptionText,
                        selectedDate === formatDateToISO(new Date(Date.now() + 86400000)) &&
                          styles.quickOptionTextActive,
                      ]}
                    >
                      Tomorrow
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.quickOptionPill,
                      selectedDate === formatDateToISO(new Date(Date.now() + 7 * 86400000)) &&
                        styles.quickOptionPillActive,
                    ]}
                    onPress={() => selectQuickOption(7)}
                  >
                    <Text
                      style={[
                        styles.quickOptionText,
                        selectedDate === formatDateToISO(new Date(Date.now() + 7 * 86400000)) &&
                          styles.quickOptionTextActive,
                      ]}
                    >
                      Next Week
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Month Navigator */}
                <View style={styles.monthNavRow}>
                  <TouchableOpacity
                    onPress={prevMonth}
                    style={styles.navArrowBtn}
                    accessibilityLabel="Previous month"
                  >
                    <Ionicons name="chevron-back" size={20} color={COLORS.ink} />
                  </TouchableOpacity>
                  <Text style={styles.monthLabel}>
                    {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </Text>
                  <TouchableOpacity
                    onPress={nextMonth}
                    style={styles.navArrowBtn}
                    accessibilityLabel="Next month"
                  >
                    <Ionicons name="chevron-forward" size={20} color={COLORS.ink} />
                  </TouchableOpacity>
                </View>

                {/* Weekday Row */}
                <View style={styles.weekdayRow}>
                  {WEEKDAYS.map((wd) => (
                    <Text key={wd} style={styles.weekdayText}>
                      {wd}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                  {daysInMonth.map((item, idx) => {
                    if (item.day === null) {
                      return <View key={`blank-${idx}`} style={styles.dayCell} />;
                    }

                    const isSelected = item.iso === selectedDate;
                    const isDisabled = item.isPast;

                    return (
                      <TouchableOpacity
                        key={item.iso}
                        disabled={isDisabled}
                        onPress={() => handleSelectDay(item.iso)}
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellSelected,
                          isDisabled && styles.dayCellDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                            isDisabled && styles.dayTextDisabled,
                          ]}
                        >
                          {item.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Confirm Action */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.confirmButton,
                    !selectedDate && styles.confirmButtonDisabled,
                  ]}
                  disabled={!selectedDate}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>
                    {selectedDate ? `Confirm Date (${formatDisplayDate(selectedDate)})` : "Select a Date"}
                  </Text>
                </TouchableOpacity>
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
    paddingBottom: 32,
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
  quickOptionsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  quickOptionPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.08)",
  },
  quickOptionPillActive: {
    backgroundColor: COLORS.primaryTint,
    borderColor: COLORS.primary,
  },
  quickOptionText: {
    fontSize: 12.5,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
  },
  quickOptionTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.body.bold,
  },
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navArrowBtn: {
    padding: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
  },
  monthLabel: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekdayText: {
    width: 38,
    textAlign: "center",
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkMuted,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    rowGap: 8,
    marginBottom: 20,
  },
  dayCell: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RADIUS.full,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellDisabled: {
    opacity: 0.25,
  },
  dayText: {
    fontSize: 14,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
  },
  dayTextSelected: {
    color: COLORS.white,
    fontFamily: FONTS.body.bold,
  },
  dayTextDisabled: {
    color: COLORS.inkFaint,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.inkFaint,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.body.bold,
    letterSpacing: 0.2,
  },
});
