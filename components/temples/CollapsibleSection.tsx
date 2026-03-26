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
  const [open, setOpen] = useState(true); // open by default like design

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <TouchableOpacity style={styles.header} onPress={() => setOpen(!open)}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.icon}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {/* CONTENT */}
      {open && (
        <View style={styles.content}>
          {items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.name}>{item.aarti_name}</Text>
              <Text style={styles.time}>
                {item.starting_time} - {item.ending_time}
              </Text>
            </View>
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EB5C49",
  },
  icon: {
    fontSize: 12,
    color: "#555",
  },
  content: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  name: {
    color: "#333",
    fontSize: 13,
  },
  time: {
    color: "#666",
    fontSize: 12,
  },
});
