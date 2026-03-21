import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useServices } from '@/hooks/useServices';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2; // spacing logic

export default function ServicesGrid() {
    const {data} = useServices();
 return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Our Services</Text>

      <FlatList
        data={data || []}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          // Alternate gradient colors
          const row = Math.floor(index / 2);
        const isEvenRow = row % 2 === 0;

        const isLeft = index % 2 === 0;

        const useOrange = isEvenRow ? isLeft : !isLeft;

          return (
            <LinearGradient
                colors={
                useOrange
                    ? ['#FFB88C', '#FF6A00']   // 🔥 stronger orange
                    : ['#e28a91', '#bd1c0a']   // 🔥 stronger pink/red
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.card}
            > 
                <Text style={styles.icon}>🪔</Text>

                <Text style={styles.title}>
                {item.title.rendered}
                </Text>
  </LinearGradient>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#8B1E1E',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 14, // 🔥 more spacing like design
  },

  card: {
    width: CARD_WIDTH,
    height: 120, // 🔥 slightly taller
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',

    // 🔥 Better shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  icon: {
    fontSize: 34, // 🔥 bigger icon
  },

  title: {
    fontSize: 13,
    fontWeight: '600', // 🔥 stronger
    color: '#fff', // 🔥 IMPORTANT (your design uses white text)
  },

  centerText: {
    textAlign: 'center',
    marginTop: 20,
  },
});