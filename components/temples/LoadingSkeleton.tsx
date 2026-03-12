import React from 'react';
import { View, StyleSheet } from 'react-native';

const LoadingSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1,2,3,4].map((item) => (
        <View key={item} style={styles.card} />
      ))}
    </View>
  );
};

export default LoadingSkeleton;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  card: {
    height: 90,
    backgroundColor: '#E5E5E5',
    borderRadius: 14,
    marginBottom: 16,
  },
});