import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  items: {
    aarti_name: string;
    starting_time: string;
    ending_time: string;
  }[];
}

const CollapsibleSection = ({ title, items }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.content}>
          {items.map((item, index) => (
            <Text key={index} style={styles.item}>
              {item.aarti_name} ({item.starting_time} - {item.ending_time})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(CollapsibleSection);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "600",
  },
  content: {
    marginTop: 10,
  },
  item: {
    color: "#555",
    marginBottom: 4,
  },
});
