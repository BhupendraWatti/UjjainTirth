import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Har Har Mahadev</Text>
        <Text style={styles.subtitle}>Namaste, User</Text>
      </View>

      <TouchableOpacity style={styles.searchBtn}>
        <Ionicons name="search" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B1E1E',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});