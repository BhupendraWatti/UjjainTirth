import ScreenContainer from "@/components/layout/ScreenContainer";
import ComingSoon from "@/components/ui/ComingSoon";
import MenuItem from "@/components/ui/MenuItem";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const comingsoon = () => {
  <ComingSoon title="Coming Soon" subtitle=" "></ComingSoon>;
};
export default function MoreScreen() {
  return (
    <ScreenContainer>
      {/* USER CARD */}
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={20} color="#fff" />
          </View>

          <View>
            <Text style={styles.userName}>Not User</Text>
            <Text style={styles.userSub}>Are you logged in?</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginBtn}>
          <Text
            onPress={() => router.push("/coming-soon")}
            style={styles.loginText}
          >
            Login / Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* MENU LIST */}
      <View style={styles.menuCard}>
        <MenuItem
          onPress={comingsoon}
          title="My Bookings"
          icon="calendar-outline"
        />
        <MenuItem
          onPress={() => router.push("/coming-soon")}
          title="Contact Us"
          icon="call-outline"
        />
        <MenuItem
          onPress={() => router.push("/coming-soon")}
          title="About Ujjain"
          icon="information-circle-outline"
        />
        <MenuItem
          onPress={() => router.push("/coming-soon")}
          title="Language"
          icon="globe-outline"
        />
        <MenuItem
          onPress={() => router.push("/coming-soon")}
          title="Help & Support"
          icon="help-circle-outline"
        />
        <MenuItem
          onPress={() => router.push("/coming-soon")}
          title="Privacy Policy"
          icon="shield-checkmark-outline"
        />
      </View>

      {/* SUPPORT CARD */}
      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>Need Assistance?</Text>
        <Text style={styles.supportSub}>We’re here to help you.</Text>

        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call-outline" size={18} color="#fff" />
          <Text
            onPress={() => router.push("/coming-soon")}
            style={styles.callText}
          >
            Call Now
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  userSub: {
    fontSize: 12,
    color: "#777",
  },
  loginBtn: {
    backgroundColor: "#FF6B00",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    padding: 10,
  },

  supportCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  supportSub: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },
  callBtn: {
    flexDirection: "row",
    backgroundColor: "#FF6B00",
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  callText: {
    color: "#fff",
    fontWeight: "600",
  },
});
