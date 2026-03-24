import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  mapUrl?: string;
  onPress: () => void;
}

const MapCard = ({ mapUrl, onPress }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.mapPlaceholder}>
        <Text>Map Preview</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View on Map</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(MapCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: "#eee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#EB5C49",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
});
