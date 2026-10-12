import React from 'react';
import {
  View,
  StyleSheet,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/typography';

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'No data found' }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  text: {
    fontSize: 16,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
});