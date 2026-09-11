import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { RADIUS, SHADOWS } from '@/constants/theme';
import { FONTS } from '@/constants/typography';

interface ErrorStateProps {
  onRetry?: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Something went wrong</Text>

      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  text: {
    fontSize: 16,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    ...SHADOWS.subtle,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.body.bold,
  },
});
