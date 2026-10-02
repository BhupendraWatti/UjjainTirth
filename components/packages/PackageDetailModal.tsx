import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { APP_CONFIG } from "@/constants/appConfig";
import { usePackageDetail } from "@/hooks/useProducts";
import { Package } from "@/types/product";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  item: Package | null;
  onClose: () => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1609766418204-df41e949e4a3?w=800&q=80";

// Strip HTML tags and extract list items
function stripHtml(html: string): string[] {
  if (!html) return [];
  const items: string[] = [];
  const regex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#8211;/g, "–")
      .replace(/\u2013/g, "–")
      .trim();
    if (text) items.push(text);
  }
  // Fallback: if no <li> tags found, try splitting by newlines
  if (items.length === 0 && html.trim()) {
    const plainText = html
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/\\n/g, "\n")
      .trim();
    const lines = plainText.split("\n").filter((l) => l.trim());
    items.push(...lines);
  }
  return items;
}

// Clean HTML entities from short_description
function cleanHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/<\/p>/g, "")
    .trim();
}

export default function PackageDetailModal({ visible, item, onClose }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const heroHeight = Math.min(320, Math.max(220, height * 0.4));
  // Fetch full details when modal opens
  const { packageDetail, loading: detailLoading } = usePackageDetail(
    visible && item ? item.id : null
  );

  // Use full detail if available, fallback to basic item
  const pkg = packageDetail || item;

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible && pkg && !detailLoading) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [detailLoading, fadeAnim, pkg, slideAnim, visible]);

  const handleCall = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const telUrl = Platform.select({
      ios: `telprompt:${APP_CONFIG.SUPPORT_PHONE}`,
      android: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
      default: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
    });
    try {
      if (await Linking.canOpenURL(telUrl)) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert("Cannot Make Call", "Phone calling is not supported on this device.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong while trying to make the call.");
    }
  };

  const handleBooking = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const cleanPhone = (APP_CONFIG.SUPPORT_PHONE || "919179187199").replace(/[^0-9]/g, "");
    const message = `🙏 Jai Shree Mahakal! I want to book the "${pkg?.name || item?.name}" package (₹${pkg?.price || ""}). Please guide me with the booking details.`;
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    try {
      if (await Linking.canOpenURL(whatsappUrl)) {
        await Linking.openURL(whatsappUrl);
      } else {
        handleCall();
      }
    } catch {
      handleCall();
    }
  };

  if (!item) return null;

  const details = pkg?.package_details;
  const additionalInfo = pkg?.additional_info;
  const imageUri =
    pkg?.image && pkg.image.trim() !== "" ? pkg.image : PLACEHOLDER_IMAGE;

  const thingsToCarry = stripHtml(additionalInfo?.things_to_carry || "");
  const cancellationPolicy = stripHtml(
    additionalInfo?.cancellation_policy || ""
  );

  // Info row data
  const infoItems = [
    {
      icon: "🚗",
      label: "Transport",
      value: details?.transport,
      bgColor: "#FFF3E0",
    },
    {
      icon: "🏨",
      label: "Stay",
      value: details?.stay_type,
      bgColor: "#E8F5E9",
    },
    {
      icon: "🍽️",
      label: "Meals",
      value: details?.meals,
      bgColor: "#FDE8E5",
    },
    {
      icon: "📍",
      label: "Pickup",
      value: details?.pickup_location,
      bgColor: "#E3F2FD",
    },
    {
      icon: "📍",
      label: "Drop",
      value: details?.drop_location,
      bgColor: "#F3E5F5",
    },
  ].filter((i) => i.value && i.value.trim() !== "");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Loading overlay when detail is being fetched */}
        {detailLoading && (
          <View style={styles.loadingOverlay}>
            {/* Show basic info while loading */}
            <View style={[styles.heroContainer, { height: heroHeight }]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.heroGradient}
              />
              <TouchableOpacity
                style={[styles.closeButton, { top: Math.max(12, insets.top + 8) }]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  onClose();
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Close package details"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.heroTitleContainer}>
                <Text style={styles.heroTitle}>{item.name}</Text>
              </View>
            </View>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading details...</Text>
            </View>
          </View>
        )}

        {/* Full content when loaded */}
        {!detailLoading && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {/* Hero Image */}
            <View style={[styles.heroContainer, { height: heroHeight }]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.75)"]}
                style={styles.heroGradient}
              />

              {/* Close button with defensive glassmorphic pill */}
              <TouchableOpacity
                style={[styles.closeButton, { top: Math.max(12, insets.top + 8) }]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  onClose();
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Close package details"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Title on image */}
              <View style={styles.heroTitleContainer}>
                <Text style={styles.heroTitle}>{pkg?.name}</Text>
                <View style={styles.heroBadgeRow}>
                  {pkg?.duration?.trim() ? (
                    <View style={styles.heroDurationBadge}>
                      <Ionicons name="time-outline" size={13} color="#FFFFFF" />
                      <Text style={styles.heroDuration}>
                        {pkg.duration.trim()}
                      </Text>
                    </View>
                  ) : null}
                  {details?.transport ? (
                    <View style={styles.heroTransportBadge}>
                      <Ionicons name="car-outline" size={13} color="#FFFFFF" />
                      <Text style={styles.heroDuration}>
                        {details.transport}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Price Banner - Upper Fold Price Discovery */}
              {pkg?.price ? (
                <View style={styles.priceBanner}>
                  <View>
                    <Text style={styles.priceLabel}>Package Dakshina</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceSymbol}>₹</Text>
                      <Text style={styles.priceAmount}>{pkg.price}</Text>
                      <Text style={styles.priceUnitText}>/ person</Text>
                    </View>
                  </View>
                  <View style={styles.priceBadge}>
                    <Ionicons name="sparkles" size={12} color={COLORS.primary} />
                    <Text style={styles.priceBadgeText}>Best Value</Text>
                  </View>
                </View>
              ) : null}

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About This Package</Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText}>
                    {cleanHtmlEntities(
                      details?.package_description ||
                      pkg?.description ||
                      ""
                    )}
                  </Text>
                  {details?.short_description && (
                    <View style={styles.shortDescRow}>
                      <View style={styles.shortDescDot} />
                      <Text style={styles.shortDescText}>
                        {cleanHtmlEntities(details.short_description)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Section Divider */}
              <View style={styles.sectionDivider} />

              {/* Package Highlights */}
              {infoItems.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionTitleAccent} />
                    <Text style={styles.sectionTitle}>Package Highlights</Text>
                  </View>
                  <View style={styles.gridContainer}>
                    {infoItems.map((info, idx) => (
                      <View key={idx} style={styles.gridItem}>
                        <View
                          style={[
                            styles.gridIconBg,
                            { backgroundColor: info.bgColor },
                          ]}
                        >
                          <Text style={styles.gridIcon}>{info.icon}</Text>
                        </View>
                        <Text style={styles.gridLabel}>{info.label}</Text>
                        <Text style={styles.gridValue} numberOfLines={2}>
                          {info.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Location Info */}
              {(details?.pickup_location || details?.drop_location) && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionTitleAccent} />
                    <Text style={styles.sectionTitle}>Travel Details</Text>
                  </View>
                  <View style={styles.locationCard}>
                    {details?.pickup_location && (
                      <View style={styles.locationItem}>
                        <View style={styles.locationDotGreen} />
                        <View style={styles.locationTextContainer}>
                          <Text style={styles.locationLabel}>
                            Pickup Location
                          </Text>
                          <Text style={styles.locationValue}>
                            {details.pickup_location}
                          </Text>
                        </View>
                      </View>
                    )}
                    {details?.pickup_location && details?.drop_location && (
                      <View style={styles.locationLine} />
                    )}
                    {details?.drop_location && (
                      <View style={styles.locationItem}>
                        <View style={styles.locationDotRed} />
                        <View style={styles.locationTextContainer}>
                          <Text style={styles.locationLabel}>
                            Drop Location
                          </Text>
                          <Text style={styles.locationValue}>
                            {details.drop_location}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Things to Carry */}
              {thingsToCarry.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionTitleAccent} />
                    <Text style={styles.sectionTitle}>
                      🎒 Things to Carry
                    </Text>
                  </View>
                  <View style={styles.listCard}>
                    {thingsToCarry.map((carryItem, index) => (
                      <View key={index} style={styles.listItem}>
                        <View style={styles.checkCircle}>
                          <Text style={styles.checkMark}>✓</Text>
                        </View>
                        <Text style={styles.listText}>{carryItem}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Cancellation Policy */}
              {cancellationPolicy.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionTitleAccent} />
                    <Text style={styles.sectionTitle}>
                      📋 Cancellation Policy
                    </Text>
                  </View>
                  <View style={styles.policyCard}>
                    {cancellationPolicy.map((policyItem, index) => {
                      const dotColors = [
                        "#4CAF50",
                        "#FF9800",
                        "#F44336",
                        "#9E9E9E",
                      ];
                      const bgColors = [
                        "#E8F5E9",
                        "#FFF3E0",
                        "#FFEBEE",
                        "#F5F5F5",
                      ];
                      return (
                        <View
                          key={index}
                          style={[
                            styles.policyItem,
                            {
                              backgroundColor:
                                bgColors[index] || bgColors[3],
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.policyDot,
                              {
                                backgroundColor:
                                  dotColors[index] || dotColors[3],
                              },
                            ]}
                          />
                          <Text style={styles.policyText}>
                            {policyItem}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Notes */}
              {additionalInfo?.notes && (
                <View style={[styles.section, { marginBottom: 8 }]}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionTitleAccent} />
                    <Text style={styles.sectionTitle}>
                      📝 Important Notes
                    </Text>
                  </View>
                  <View style={styles.notesCard}>
                    <Text style={styles.notesText}>
                      {additionalInfo.notes.replace(/\\r\\n|\\r|\\n/g, "\n")}
                    </Text>
                  </View>
                </View>
              )}

              {/* Bottom spacing — enough room for fixed action bar + safe area */}
              <View style={{ height: 140 }} />
            </Animated.View>
          </ScrollView>
        )}

        {/* Fixed bottom action bar with safe area integration */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(16, insets.bottom + 6) },
          ]}
        >
          <TouchableOpacity
            style={styles.bottomEnquiry}
            activeOpacity={0.8}
            onPress={handleCall}
            accessibilityRole="button"
            accessibilityLabel="Call support for package enquiry"
          >
            <Ionicons name="call-outline" size={17} color={COLORS.primary} />
            <Text style={styles.bottomEnquiryText}>Enquiry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomBook}
            activeOpacity={0.85}
            onPress={handleBooking}
            accessibilityRole="button"
            accessibilityLabel="Book package on WhatsApp"
          >
            <LinearGradient
              colors={[COLORS.primary, "#D94535"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bottomBookGradient}
            >
              <View style={styles.bottomBookRow}>
                <Ionicons name="logo-whatsapp" size={17} color="#FFFFFF" />
                <Text style={styles.bottomBookText}>
                  {pkg?.price ? `Book Now • ₹${pkg.price}` : "Book Now"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // Loading
  loadingOverlay: {
    flex: 1,
  },

  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  loadingText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  // Hero
  heroContainer: {
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },

  closeButton: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(20, 15, 15, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    zIndex: 10,
  },

  closeButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  heroTitleContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },

  heroTitle: {
    fontSize: 24,
    fontFamily: FONTS.display.bold,
    color: "#FFF",
    marginBottom: 8,
    lineHeight: 30,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: -0.3,
  },

  heroBadgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  heroDurationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  heroTransportBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  heroDurationIcon: {
    fontSize: 13,
  },

  heroDuration: {
    fontSize: 13,
    color: "#FFF",
    fontWeight: "700",
  },

  // Price Banner
  priceBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: -28,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(235,92,73,0.08)",
  },

  priceLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },

  priceSymbol: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },

  priceAmount: {
    fontSize: 32,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.primary,
    letterSpacing: -0.5,
  },

  priceBadge: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },

  priceUnitText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontFamily: FONTS.body.medium,
    marginLeft: 4,
  },

  priceBadgeEmoji: {
    fontSize: 12,
  },

  priceBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.success,
    letterSpacing: 0.3,
  },

  // Section divider
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.hairline,
    marginHorizontal: 16,
    marginTop: 20,
  },

  // Sections
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },

  sectionTitleAccent: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },

  // Description Card
  descriptionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 20,
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },

  descriptionText: {
    fontSize: 15,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 24,
  },

  shortDescRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0EDED",
    gap: 10,
  },

  shortDescDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 7,
  },

  shortDescText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    fontStyle: "italic",
    flex: 1,
    lineHeight: 20,
  },

  // Grid
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  gridItem: {
    flexBasis: "45%",
    flexGrow: 1,
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },

  gridIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  gridIcon: {
    fontSize: 24,
  },

  gridLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  gridValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },

  // Location Card
  locationCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },

  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },

  locationDotGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    marginTop: 4,
    borderWidth: 3,
    borderColor: "#E8F5E9",
  },

  locationDotRed: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#F44336",
    marginTop: 4,
    borderWidth: 3,
    borderColor: "#FFEBEE",
  },

  locationLine: {
    width: 2,
    height: 28,
    backgroundColor: "#E0E0E0",
    marginLeft: 6,
    marginVertical: 4,
    borderRadius: 1,
  },

  locationTextContainer: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },

  locationValue: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "600",
  },

  // List Card (Things to carry)
  listCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.15)",
  },

  checkMark: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "800",
  },

  listText: {
    fontSize: 14,
    color: COLORS.textDark,
    flex: 1,
    lineHeight: 21,
    fontWeight: "500",
  },

  // Policy Card
  policyCard: {
    gap: 10,
  },

  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },

  policyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  policyText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "500",
    flex: 1,
    lineHeight: 21,
  },

  // Notes
  notesCard: {
    backgroundColor: "#FFFBF0",
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FFB300",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  notesText: {
    fontSize: 14,
    color: "#5D4037",
    lineHeight: 23,
    fontWeight: "500",
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },

  bottomEnquiry: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(235,92,73,0.04)",
  },

  bottomEnquiryText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  bottomBook: {
    flex: 1.6,
    borderRadius: 14,
    overflow: "hidden",
  },

  bottomBookGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },

  bottomBookRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  bottomBookText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.2,
  },
});
