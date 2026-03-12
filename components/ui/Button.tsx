import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
}

const Button = ({ label, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6A00',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});