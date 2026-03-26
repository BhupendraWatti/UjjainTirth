import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Temple } from "@/types/temple";

interface TempleCardProps {
  temple: Temple;
}

const TempleCard = ({ temple }: TempleCardProps) => {
  const router = useRouter();

  // const image =
  //   temple._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
  //   'https://via.placeholder.com/300';
  const image = temple.image || "https://via.placeholder.com/300";
  const title = temple.title;

  // const tag = temple.acf.temple_tag.name;
  const tag = temple?.acf?.temple_tag?.name || "No Tag";

  // const description = temple.acf.temple_short_description
  //   .replace(/<[^>]+>/g, "")
  //   .slice(0, 110);

  const description = temple?.acf?.temple_short_description
    ? temple.acf.temple_short_description.replace(/<[^>]+>/g, "").slice(0, 110)
    : "";
  const handlePress = () => {
    // console.log("CLICKED:", temple.slug);

    if (!temple.slug) {
      // console.log("Slug missing!");
      return;
    }

    router.push({
      pathname: "/temples/[slug]" as any,
      params: { slug: temple.slug },
    });
  };
  // console.log("Navigating to:", `/temples/${temple.slug}`);
  // console.log("TEMPLE:", temple);
  // console.log("TEMPLE DATA:", JSON.stringify(temple, null, 2));
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.footer}>
            <Badge label={tag} />

            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
              <Text style={styles.viewDetails}>View Details →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default memo(TempleCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },

  content: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B0000",
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewDetails: {
    color: "#FF6A00",
    fontWeight: "600",
  },
});
