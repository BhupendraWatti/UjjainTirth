import ScreenContainer from "@/components/layout/ScreenContainer";
import { NeedAssistance, SettingsMenuList, ShareApp, UserCard } from "@/components/more";
import { APP_CONFIG } from "@/constants/appConfig";
import {
  buildShareMessage,
  cacheShareContent,
  fetchShareContent,
  getCachedShareContent,
  ShareContentData,
} from "@/services/shareServices";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const DEFAULT_SHARE_DATA: ShareContentData = {
  title: "🙏 Download Ujjain Tirth",
  description: "Your spiritual companion for Ujjain pilgrimage. Get daily aartis, temple information, mantras, and more!",
  link: APP_CONFIG.WEBSITE_URL,
  cta: "📱 Download now and embark on your spiritual journey!",
};

export default function MoreScreen() {
  const [shareData, setShareData] = useState<ShareContentData | null>(null);

  useEffect(() => {
    const loadShareContent = async () => {
      // 1. Load cached data first (fast)
      const cached = await getCachedShareContent();
      let initialData: ShareContentData;

      if (cached) {
        initialData = cached;
      } else {
        initialData = DEFAULT_SHARE_DATA;
      }
      setShareData(initialData);

      // 2. Fetch latest from API (background, non-blocking)
      try {
        const freshData = await fetchShareContent();

        // 3. Update if different from initial load
        if (JSON.stringify(freshData) !== JSON.stringify(initialData)) {
          setShareData(freshData);
          await cacheShareContent(freshData);
        }
      } catch {
        // API failed - keep cached/default, already set above
      }
    };

    loadShareContent();
  }, []);

  // Debug log for image URL
  useEffect(() => {
    if (shareData) {
      // console.log("Share Data:", JSON.stringify(shareData, null, 2));
    }
  }, [shareData]);

  const shareMessage = shareData ? buildShareMessage(shareData) : "";

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Section 1: Sign Up / Sign In ── */}
        <UserCard />

        {/* ── Section 2: Mobile Settings ── */}
        <SettingsMenuList />

        {/* ── Section 3: Need Assistance ── */}
        <View style={styles.sectionSpacing}>
          <NeedAssistance />
        </View>

        {/* ── Section 4: Share App ── */}
        {shareData ? (
          <View style={styles.sectionSpacing}>
            <ShareApp shareMessage={shareMessage} shareData={shareData} />
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // room for bottom tab bar
  },
  sectionSpacing: {
    marginTop: 16,
  },
});
