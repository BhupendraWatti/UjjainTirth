import React from "react";
import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
} from "react-native";

/**
 * App-wide ceiling for the user's system font size (Android "Font size",
 * iOS Dynamic Type). Text still follows the setting up to 130%, which keeps
 * it readable without breaking dense cards, rows and buttons.
 * Elements can still pass their own (lower or higher) maxFontSizeMultiplier.
 */
export const MAX_FONT_SCALE = 1.3;

/** Drop-in replacement for react-native's Text with the app font-scale cap. */
export const Text = React.forwardRef<RNText, TextProps>(function AppText(
  { maxFontSizeMultiplier = MAX_FONT_SCALE, ...props },
  ref,
) {
  return (
    <RNText ref={ref} maxFontSizeMultiplier={maxFontSizeMultiplier} {...props} />
  );
});
// Type alias so `useRef<Text>` keeps working after switching imports.
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Text = RNText;

/** Drop-in replacement for react-native's TextInput with the app font-scale cap. */
export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  function AppTextInput(
    { maxFontSizeMultiplier = MAX_FONT_SCALE, ...props },
    ref,
  ) {
    return (
      <RNTextInput
        ref={ref}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        {...props}
      />
    );
  },
);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TextInput = RNTextInput;
