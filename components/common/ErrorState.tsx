import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  onRetry?: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Something went wrong</Text>

      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
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
    color: '#777',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF6A00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});