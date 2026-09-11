import React from "react";
import { View, Text as RNText, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
} from "react-native-svg";

/**
 * Trishul Logo with Tripundra and subtle Om branding
 */
export function TrishulLogo({ size = 36, color = "#C47D2B" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none">
      <Defs>
        <LinearGradient id="trishulGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E29C38" />
          <Stop offset="50%" stopColor="#C47D2B" />
          <Stop offset="100%" stopColor="#965B17" />
        </LinearGradient>
      </Defs>
      {/* Central Blade / Spear */}
      <Path
        d="M20 2 L22.5 12 L21.2 32 L18.8 32 L17.5 12 Z"
        fill="url(#trishulGrad)"
      />
      {/* Central Flame / Tip */}
      <Path
        d="M20 0 L23 7 L17 7 Z"
        fill="#F4B752"
      />
      {/* Left Trident Prong */}
      <Path
        d="M20 22 C14 22 7 16 6 8 C6 6 8 6 9 8 C11 13 14 18 19 18.5 Z"
        fill="url(#trishulGrad)"
      />
      <Path
        d="M6 8 L8 4 L10 9 Z"
        fill="#F4B752"
      />
      {/* Right Trident Prong */}
      <Path
        d="M20 22 C26 22 33 16 34 8 C34 6 32 6 31 8 C29 13 26 18 21 18.5 Z"
        fill="url(#trishulGrad)"
      />
      <Path
        d="M34 8 L32 4 L30 9 Z"
        fill="#F4B752"
      />
      {/* Damru / Tripundra horizontal bar */}
      <Rect x="14" y="27" width="12" height="2.5" rx="1.2" fill="url(#trishulGrad)" />
      <Circle cx="20" cy="28.2" r="1.5" fill="#FFF" />
      {/* Lower Staff */}
      <Path d="M19 32 L21 32 L21 44 L19 44 Z" fill="url(#trishulGrad)" />
      <Circle cx="20" cy="44.5" r="1.5" fill="#C47D2B" />
    </Svg>
  );
}

/**
 * Sacred Temple Skyline Illustration for Login & OTP screens
 * Detailed fine-line sketch of Mahakal Shikharas, kalash, flags, river steps and glowing sunrise
 */
export function TempleSkylineArt({
  width = 360,
  height = 180,
  style,
}: {
  width?: number;
  height?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ width, height, alignItems: "center", justifyContent: "center", position: "relative" }, style]}>
      <Svg width={width} height={height} viewBox="0 0 400 200" fill="none">
        <Defs>
          <RadialGradient id="sunGlow" cx="50%" cy="45%" r="45%">
            <Stop offset="0%" stopColor="#FDF2D9" stopOpacity="0.95" />
            <Stop offset="50%" stopColor="#F9E6C3" stopOpacity="0.6" />
            <Stop offset="85%" stopColor="#F5DCB2" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="templeStroke" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#B37830" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#8C5819" stopOpacity="0.55" />
          </LinearGradient>
          <LinearGradient id="templeFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F5E4C7" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#EAD2AB" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        {/* Glowing Sun Halo */}
        <Circle cx="200" cy="90" r="70" fill="url(#sunGlow)" />
        <Circle cx="200" cy="90" r="82" stroke="#E6C894" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

        {/* Central Temple Shikhara (Mahakaleshwar) */}
        {/* Main spire */}
        <Path
          d="M200 48 L208 72 L212 110 L216 160 L184 160 L188 110 L192 72 Z"
          fill="url(#templeFill)"
          stroke="url(#templeStroke)"
          strokeWidth="1.2"
        />
        {/* Amalaka & Kalash on Top */}
        <Circle cx="200" cy="46" r="3" fill="#D49339" stroke="#8C5819" strokeWidth="0.8" />
        <Path d="M200 43 L200 36 L206 38 Z" fill="#E28D34" />
        {/* Shikhara Ridge Details */}
        <Path d="M194 85 L206 85 M191 108 L209 108 M188 132 L212 132" stroke="url(#templeStroke)" strokeWidth="0.8" />
        {/* Sanctum Arch */}
        <Path d="M195 160 C195 148 205 148 205 160" stroke="url(#templeStroke)" strokeWidth="1" fill="#E8CDA4" />

        {/* Left Temple Spire (Harsiddhi / Omkareshwar style) */}
        <Path
          d="M142 70 L148 90 L152 120 L155 162 L125 162 L128 120 L132 90 Z"
          fill="url(#templeFill)"
          stroke="url(#templeStroke)"
          strokeWidth="1.1"
        />
        <Circle cx="140" cy="68" r="2.5" fill="#D49339" stroke="#8C5819" strokeWidth="0.7" />
        <Path d="M140 66 L140 60 L145 62 Z" fill="#E28D34" />
        <Path d="M134 100 L146 100 M131 125 L149 125" stroke="url(#templeStroke)" strokeWidth="0.7" />

        {/* Right Temple Spire (Kal Bhairav style) */}
        <Path
          d="M260 72 L266 92 L270 120 L273 162 L245 162 L248 120 L252 92 Z"
          fill="url(#templeFill)"
          stroke="url(#templeStroke)"
          strokeWidth="1.1"
        />
        <Circle cx="260" cy="70" r="2.5" fill="#D49339" stroke="#8C5819" strokeWidth="0.7" />
        <Path d="M260 68 L260 62 L265 64 Z" fill="#E28D34" />
        <Path d="M254 100 L266 100 M250 125 L270 125" stroke="url(#templeStroke)" strokeWidth="0.7" />

        {/* Secondary Background Shrines & Domes */}
        <Path d="M95 110 L102 125 L106 162 L84 162 L88 125 Z" fill="url(#templeFill)" stroke="url(#templeStroke)" strokeWidth="0.9" />
        <Path d="M305 112 L312 125 L316 162 L294 162 L298 125 Z" fill="url(#templeFill)" stroke="url(#templeStroke)" strokeWidth="0.9" />
        <Path d="M60 130 L66 142 L68 165 L52 165 L54 142 Z" stroke="url(#templeStroke)" strokeWidth="0.7" fill="url(#templeFill)" />
        <Path d="M340 128 L346 142 L348 165 L332 165 L334 142 Z" stroke="url(#templeStroke)" strokeWidth="0.7" fill="url(#templeFill)" />

        {/* Ram Ghat River Steps (Pauranic Stone Stairs) */}
        <Path d="M30 165 L370 165" stroke="url(#templeStroke)" strokeWidth="1.5" />
        <Path d="M20 172 L380 172" stroke="url(#templeStroke)" strokeWidth="1.2" />
        <Path d="M10 179 L390 179" stroke="url(#templeStroke)" strokeWidth="1" />
        <Path d="M0 186 L400 186" stroke="url(#templeStroke)" strokeWidth="0.8" />

        {/* Holy Shipra Water Ripples */}
        <Path d="M40 193 C60 191 80 195 100 193 C120 191 140 195 160 193 C180 191 200 195 220 193 C240 191 260 195 280 193 C300 191 320 195 340 193 C360 191 380 195 400 193" stroke="#D1A767" strokeWidth="0.8" opacity="0.5" />
        <Path d="M20 198 C40 196 60 200 80 198 C100 196 120 200 140 198 C160 196 180 200 200 198 C220 196 240 200 260 198 C280 196 300 200 320 198 C340 196 360 200 380 198" stroke="#D1A767" strokeWidth="0.8" opacity="0.4" />
      </Svg>
      {/* Sacred Om Symbol in Sun - Native Text */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: height * 0.36,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RNText style={styles.omSunText}>{"ॐ"}</RNText>
      </View>
    </View>
  );
}

/**
 * Radiant Sacred Mandala Aura for OTP Verification Screen
 * Concentric sacred geometry rings with central golden disc and Om symbol
 */
export function MandalaAura({ size = 280 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 300 300" fill="none">
        <Defs>
          <RadialGradient id="mandalaCenterGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#F9E2B6" stopOpacity="0.95" />
            <Stop offset="40%" stopColor="#F5D396" stopOpacity="0.6" />
            <Stop offset="75%" stopColor="#F1C27A" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="innerOmDisc" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFF9EB" stopOpacity="1" />
            <Stop offset="80%" stopColor="#F7E6C4" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#EDD097" stopOpacity="0.8" />
          </RadialGradient>
          <LinearGradient id="goldLine" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#E2A645" />
            <Stop offset="100%" stopColor="#BC7D22" />
          </LinearGradient>
        </Defs>

        {/* Ambient Glow */}
        <Circle cx="150" cy="150" r="140" fill="url(#mandalaCenterGlow)" />

        {/* Outermost dotted halo */}
        <Circle cx="150" cy="150" r="136" stroke="#DCA24D" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
        <Circle cx="150" cy="150" r="122" stroke="#E6B468" strokeWidth="0.8" opacity="0.4" />

        {/* 16 Mandala Petals Ring */}
        <G transform="translate(150, 150)">
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
            (angle, idx) => (
              <G key={idx} transform={`rotate(${angle})`}>
                <Path
                  d="M0 -90 C-8 -105 0 -118 0 -120 C0 -118 8 -105 0 -90"
                  stroke="url(#goldLine)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
                <Circle cx="0" cy="-122" r="1.5" fill="#D49339" opacity="0.7" />
              </G>
            )
          )}
        </G>

        {/* Intermediate Ring with Lotus Arc Points */}
        <Circle cx="150" cy="150" r="92" stroke="#C88E38" strokeWidth="1.2" opacity="0.65" />
        <Circle cx="150" cy="150" r="84" stroke="#E0AB57" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />

        {/* 8 Inner Petals */}
        <G transform="translate(150, 150)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <G key={idx} transform={`rotate(${angle})`}>
              <Path
                d="M0 -58 C-12 -68 -8 -80 0 -84 C8 -80 12 -68 0 -58"
                stroke="url(#goldLine)"
                strokeWidth="1.2"
                fill="#F7E6C8"
                fillOpacity="0.45"
              />
            </G>
          ))}
        </G>

        {/* Sacred Om Center Disc */}
        <Circle cx="150" cy="150" r="50" fill="url(#innerOmDisc)" stroke="#D49339" strokeWidth="1.5" />
        <Circle cx="150" cy="150" r="44" stroke="#F1CD87" strokeWidth="0.8" strokeDasharray="2 2" />
      </Svg>
      {/* Central Om Symbol - Native Text */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RNText style={[styles.mandalaOmText, { fontSize: size * 0.14 }]}>{"ॐ"}</RNText>
      </View>
    </View>
  );
}

/**
 * Sacred Mandala Half Door Wing
 * Represents Left or Right door wing of the sacred concentric mandala.
 * Perfectly symmetric, meets at x=center with 0px gap.
 */
export function SacredMandalaHalf({
  side,
  size = 340,
  opacity = 0.38,
}: {
  side: "left" | "right";
  size?: number;
  opacity?: number;
}) {
  const halfWidth = size / 2;
  const isLeft = side === "left";
  // ViewBox: Full circle is 0 0 340 340, center is (170, 170).
  // Left side shows 0 to 170 in x; Right side shows 170 to 340 in x.
  const viewBox = isLeft ? "0 0 170 340" : "170 0 170 340";

  return (
    <View style={{ width: halfWidth, height: size, overflow: "hidden", opacity }}>
      <Svg width={halfWidth} height={size} viewBox={viewBox} fill="none">
        <Defs>
          <RadialGradient id={`mandalaGlow_${side}`} cx="170" cy="170" r="160">
            <Stop offset="0%" stopColor="#F9E2B6" stopOpacity="0.8" />
            <Stop offset="60%" stopColor="#F5D396" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id={`goldStroke_${side}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#E5AC4D" />
            <Stop offset="50%" stopColor="#C9882B" />
            <Stop offset="100%" stopColor="#A86B18" />
          </LinearGradient>
        </Defs>

        {/* Ambient subtle glow background */}
        <Circle cx="170" cy="170" r="160" fill={`url(#mandalaGlow_${side})`} />

        {/* Outermost Beaded Circle Ring */}
        <Circle cx="170" cy="170" r="160" stroke="#DCA24D" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />
        <Circle cx="170" cy="170" r="152" stroke="#E6B468" strokeWidth="1" opacity="0.75" />
        <Circle cx="170" cy="170" r="146" stroke="#C9882B" strokeWidth="0.6" strokeDasharray="1.5 2.5" opacity="0.5" />

        {/* Outer 24 Petals Ring */}
        <G transform="translate(170, 170)">
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map(
            (angle, idx) => (
              <G key={`outer_${idx}`} transform={`rotate(${angle})`}>
                <Path
                  d="M0 -124 C-7 -138 0 -150 0 -152 C0 -150 7 -138 0 -124"
                  stroke={`url(#goldStroke_${side})`}
                  strokeWidth="1"
                  fill="none"
                  opacity="0.85"
                />
                <Circle cx="0" cy="-152" r="1.5" fill="#D49339" opacity="0.9" />
              </G>
            )
          )}
        </G>

        {/* Concentric Intermediate Geometric Rings */}
        <Circle cx="170" cy="170" r="124" stroke="#C88E38" strokeWidth="1.2" opacity="0.8" />
        <Circle cx="170" cy="170" r="116" stroke="#E0AB57" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.65" />
        <Circle cx="170" cy="170" r="102" stroke="#C88E38" strokeWidth="1" opacity="0.7" />

        {/* Intermediate 16 Lotus Petals */}
        <G transform="translate(170, 170)">
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
            (angle, idx) => (
              <G key={`mid_${idx}`} transform={`rotate(${angle})`}>
                <Path
                  d="M0 -78 C-10 -90 -6 -100 0 -102 C6 -100 10 -90 0 -78"
                  stroke={`url(#goldStroke_${side})`}
                  strokeWidth="1.1"
                  fill="#FDF3DD"
                  fillOpacity="0.4"
                  opacity="0.85"
                />
              </G>
            )
          )}
        </G>

        {/* Inner Geometric Rings */}
        <Circle cx="170" cy="170" r="76" stroke="#C88E38" strokeWidth="1.2" opacity="0.8" />
        <Circle cx="170" cy="170" r="68" stroke="#E0AB57" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

        {/* 8 Inner Sacred Petals */}
        <G transform="translate(170, 170)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <G key={`in_${idx}`} transform={`rotate(${angle})`}>
              <Path
                d="M0 -46 C-9 -54 -5 -66 0 -68 C5 -66 9 -54 0 -46"
                stroke={`url(#goldStroke_${side})`}
                strokeWidth="1.2"
                fill="#F7E6C8"
                fillOpacity="0.5"
              />
            </G>
          ))}
        </G>

        {/* Center Medallion Rings */}
        <Circle cx="170" cy="170" r="44" stroke="#D49339" strokeWidth="1.3" fill="#FFFBF2" fillOpacity="0.4" />
        <Circle cx="170" cy="170" r="38" stroke="#F1CD87" strokeWidth="0.8" strokeDasharray="2 2" />
        <Circle cx="170" cy="170" r="26" stroke="#D49339" strokeWidth="0.8" opacity="0.7" />
        <Circle cx="170" cy="170" r="14" stroke="#E2A645" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.6" />

        {/* Center Vertical Door Seam Hairline */}
        <Path
          d="M 170 8 L 170 332"
          stroke="#DFB362"
          strokeWidth="1"
          opacity="0.8"
        />
      </Svg>
    </View>
  );
}

/**
 * Bottom Lotus Divider Badge
 * "→ Har Yatra Mein Mahakal Ka Saath ←"
 */
export function LotusBlessingMotif({ text = "Har Yatra Mein Mahakal Ka Saath" }: { text?: string }) {
  return (
    <View style={styles.lotusContainer}>
      {/* Sacred Flowing River Wave Ripples */}
      <Svg width={220} height={16} viewBox="0 0 220 16" fill="none" style={{ marginBottom: 4 }}>
        <Path
          d="M 10 12 C 45 4, 85 16, 110 8 C 135 0, 175 14, 210 6"
          stroke="#D49F4E"
          strokeWidth="1.2"
          opacity="0.6"
        />
        <Path
          d="M 25 15 C 60 7, 100 17, 125 10 C 150 3, 185 15, 195 9"
          stroke="#C48332"
          strokeWidth="0.8"
          opacity="0.45"
        />
      </Svg>

      {/* Golden Lotus Blossom */}
      <Svg width={32} height={22} viewBox="0 0 36 26" fill="none">
        {/* Center Petal */}
        <Path d="M18 2 C15 9 16 19 18 22 C20 19 21 9 18 2 Z" fill="#D49339" />
        {/* Left Petals */}
        <Path d="M18 22 C13 20 8 13 8 7 C11 11 15 16 18 22 Z" fill="#E2A645" />
        <Path d="M18 22 C10 21 3 17 2 12 C6 15 12 18 18 22 Z" fill="#C47D2B" opacity="0.8" />
        {/* Right Petals */}
        <Path d="M18 22 C23 20 28 13 28 7 C25 11 21 16 18 22 Z" fill="#E2A645" />
        <Path d="M18 22 C26 21 33 17 34 12 C30 15 24 18 18 22 Z" fill="#C47D2B" opacity="0.8" />
        {/* Base Pad */}
        <Path d="M12 24 C15 25 21 25 24 24" stroke="#9A5D18" strokeWidth="1.2" strokeLinecap="round" />
      </Svg>
      <View style={styles.blessingRow}>
        <PathArrowLeft />
        <RNText style={styles.blessingText}>{text}</RNText>
        <PathArrowRight />
      </View>
    </View>
  );
}

function PathArrowLeft() {
  return (
    <Svg width={18} height={12} viewBox="0 0 20 12" fill="none">
      <Path d="M18 6 L4 6 M8 2 L3 6 L8 10" stroke="#C47D2B" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function PathArrowRight() {
  return (
    <Svg width={18} height={12} viewBox="0 0 20 12" fill="none">
      <Path d="M2 6 L16 6 M12 2 L17 6 L12 10" stroke="#C47D2B" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Bottom Jai Mahakal Ornamental Divider
 * "— 🔱 जय महाकाल 🔱 —"
 */
export function JaiMahakalDivider() {
  return (
    <View style={styles.jaiMahakalRow}>
      <View style={styles.dividerHairline} />
      <TrishulLogo size={14} color="#C47D2B" />
      <RNText style={styles.jaiMahakalText}>जय महाकाल</RNText>
      <TrishulLogo size={14} color="#C47D2B" />
      <View style={styles.dividerHairline} />
    </View>
  );
}

/**
 * Onboarding Winding Spiritual Yatra Path
 * The flowing golden road from top-right to bottom-left with milestone nodes
 */
export function WindingYatraTrail({
  width = 360,
  height = 360,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 360" fill="none">
      <Defs>
        <LinearGradient id="pathGradient" x1="1" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F5D89B" stopOpacity="0.85" />
          <Stop offset="35%" stopColor="#EDB862" stopOpacity="0.9" />
          <Stop offset="70%" stopColor="#E29C38" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#FAF2DF" stopOpacity="0.5" />
        </LinearGradient>
        <LinearGradient id="pathBorder" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#CFA04E" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#9C6B25" stopOpacity="0.5" />
        </LinearGradient>
      </Defs>

      {/* Main Wide Pilgrimage Road / Ribbon */}
      <Path
        d="M 330 20 
           C 310 70, 220 90, 210 130
           C 200 170, 310 190, 270 250
           C 230 300, 110 300, 40 350
           L 15 340
           C 90 280, 190 280, 240 235
           C 275 190, 175 160, 185 125
           C 195 85, 275 60, 305 15
           Z"
        fill="url(#pathGradient)"
      />

      {/* Outer Glow Borders */}
      <Path
        d="M 330 20 
           C 310 70, 220 90, 210 130
           C 200 170, 310 190, 270 250
           C 230 300, 110 300, 40 350"
        stroke="url(#pathBorder)"
        strokeWidth="1.4"
        strokeDasharray="4 3"
      />
      <Path
        d="M 305 15
           C 275 60, 195 85, 185 125
           C 175 160, 275 190, 240 235
           C 190 280, 90 280, 15 340"
        stroke="url(#pathBorder)"
        strokeWidth="1.2"
        opacity="0.8"
      />
    </Svg>
  );
}

/**
 * Onboarding Bottom Illustration:
 * Silhouette of Lord Shiva / Mahakal with Trishul on Shipra bank looking at Ujjain temples
 */
export function MahakalGhatSilhouette({
  width = 380,
  height = 190,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 200" fill="none">
      <Defs>
        <LinearGradient id="riverSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F9F1E2" stopOpacity="0.2" />
          <Stop offset="60%" stopColor="#F0DCB8" stopOpacity="0.75" />
          <Stop offset="100%" stopColor="#DFBF8C" stopOpacity="0.95" />
        </LinearGradient>
        <LinearGradient id="shivaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#634522" />
          <Stop offset="60%" stopColor="#4A3114" />
          <Stop offset="100%" stopColor="#2E1B08" />
        </LinearGradient>
        <LinearGradient id="cityGlow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#B37C33" stopOpacity="0.75" />
          <Stop offset="100%" stopColor="#784B16" stopOpacity="0.5" />
        </LinearGradient>
      </Defs>

      {/* River Sky Background */}
      <Rect x="0" y="30" width="400" height="170" fill="url(#riverSky)" />

      {/* Distant Temple City Silhouette on Ghats (Right side) */}
      <Path
        d="M170 170 L175 140 L180 140 L185 110 L190 85 L193 85 L195 72 L198 85 L202 110 L208 140 L220 140 L225 105 L230 105 L234 68 L238 68 L240 55 L242 68 L246 105 L255 130 L265 130 L270 115 L276 115 L280 92 L283 92 L285 82 L288 92 L294 115 L305 135 L320 135 L325 120 L335 120 L340 102 L345 120 L360 140 L380 140 L400 150 L400 175 L170 175 Z"
        fill="url(#cityGlow)"
        opacity="0.85"
      />
      {/* City Flags */}
      <Path d="M195 72 L195 65 L200 67 Z M240 55 L240 48 L247 50 Z M285 82 L285 76 L290 78 Z" fill="#D48628" />

      {/* River Ghat Stone Wall / Railing */}
      <Path d="M0 162 L180 162 L240 168 L400 168" stroke="#7A501F" strokeWidth="2" opacity="0.8" />
      <Path d="M0 170 L400 170" stroke="#5E3C14" strokeWidth="1.2" opacity="0.7" />

      {/* Sacred River Water Ripples */}
      <Path d="M150 175 C180 173 210 177 240 175 C270 173 300 177 330 175 C360 173 390 177 400 175" stroke="#BF904E" strokeWidth="1" opacity="0.6" />
      <Path d="M160 183 C190 181 220 185 250 183 C280 181 310 185 340 183 C370 181 390 185 400 183" stroke="#B0803E" strokeWidth="0.8" opacity="0.5" />

      {/* Majestic Silhouette of Lord Shiva / Mahakal with Trishul on Left Bank */}
      {/* Trishul held in hand */}
      <Path d="M50 35 L51 170" stroke="#3A2209" strokeWidth="2.5" />
      {/* Trishul Head */}
      <Path d="M50 35 L50 20 L53 28 L47 28 Z" fill="#2E1B08" />
      <Path d="M50 32 C43 32 38 27 37 20 C42 24 47 29 50 32 Z" fill="#2E1B08" />
      <Path d="M50 32 C57 32 62 27 63 20 C58 24 53 29 50 32 Z" fill="#2E1B08" />
      <Rect x="46" y="38" width="8" height="2" fill="#2E1B08" />

      {/* Shiva Body Profile / Back View */}
      {/* Jata (hair bun) & Crescent Moon */}
      <Path d="M72 82 C68 76 70 66 78 64 C84 63 89 67 90 73 C95 72 98 76 97 81 C97 86 92 88 88 88 C82 90 75 87 72 82 Z" fill="url(#shivaGrad)" />
      <Path d="M88 64 C87 61 90 57 93 56 C92 59 94 62 93 64 Z" fill="#F4D9A0" />
      {/* Neck & Broad Torso / Shoulders */}
      <Path
        d="M70 95 C62 98 55 106 53 118 L50 145 C56 150 64 153 72 153 C80 153 90 150 96 142 L95 116 C95 105 88 98 80 95 Z"
        fill="url(#shivaGrad)"
      />
      {/* Left Arm holding Trishul */}
      <Path d="M58 108 L48 128 L51 138 L60 125 Z" fill="url(#shivaGrad)" />
      {/* Waist & Flowing Dhoti / Tiger Skin */}
      <Path
        d="M50 145 C48 165 46 185 45 200 L95 200 C92 185 92 165 96 142 Z"
        fill="url(#shivaGrad)"
      />
      {/* Flowing sash / scarf blowing towards right */}
      <Path
        d="M85 125 C100 128 115 135 130 132 C120 138 105 138 90 135 Z"
        fill="#825726"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  omSunText: {
    fontSize: 32,
    fontFamily: FONTS.display.bold,
    color: COLORS.gold,
    textAlign: "center",
  },
  mandalaOmText: {
    fontSize: 38,
    fontFamily: FONTS.display.bold,
    color: COLORS.gold,
    textAlign: "center",
  },
  lotusContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  blessingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  blessingText: {
    fontSize: 12.5,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.gold,
    letterSpacing: 0.2,
  },
  jaiMahakalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
  },
  dividerHairline: {
    flex: 1,
    maxWidth: 60,
    height: 1,
    backgroundColor: COLORS.hairline,
  },
  jaiMahakalText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
});
