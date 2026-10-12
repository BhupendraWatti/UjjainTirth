import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function MenuItem({ title, icon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={COLORS.inkBody} />
        <Text style={styles.text}>{title}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.inkFaint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  text: {
    fontSize: 14,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
    flexShrink: 1,
  },
});
