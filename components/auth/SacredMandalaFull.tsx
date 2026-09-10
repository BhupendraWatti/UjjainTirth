import React, { useState } from "react";
import { Image, View } from "react-native";
import { MandalaAura } from "./SacredArtwork";

// Post ID 5684 — "centered chakar view" from the otp-screens API
const DEFAULT_CENTER_CHAKRA =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Golden-Om-Mandala-Medallion-1.png";

interface SacredMandalaFullProps {
  /** Single full-circle chakra image URL (Post ID 5684 from otp-screens API) */
  chakraUrl?: string;
  /** Kept for API compatibility */
  leftMandalaUrl?: string;
  /** Kept for API compatibility */
  rightMandalaUrl?: string;
  size?: number;
  opacity?: number;
}

/**
 * SacredMandalaFull
 *
 * Displays the single "Golden Om Mandala Medallion" image (Post ID 5684)
 * fetched from https://ujjaintirth.com/wp-json/custom/v1/otp-screens
 * as the full-circle chakra watermark behind the OTP input boxes.
 *
 * Falls back to the SVG MandalaAura if the image fails to load.
 */
export default function SacredMandalaFull({
  chakraUrl,
  size = 300,
  opacity = 0.38,
}: SacredMandalaFullProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedUrl = chakraUrl || DEFAULT_CENTER_CHAKRA;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      {!imageFailed ? (
        <Image
          source={{ uri: resolvedUrl }}
          style={{ width: size, height: size }}
          resizeMode="contain"
          onError={() => setImageFailed(true)}
        />
      ) : (
        /* SVG fallback — renders identical sacred geometry if image fails */
        <MandalaAura size={size} />
      )}
    </View>
  );
}
