import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';
import { COLORS } from './constants/colors';

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      ...COLORS,
    },
  },
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      primary: COLORS.primary,
      background: COLORS.bg,
      color: COLORS.ink,
      borderColor: COLORS.hairline,
      cardBackground: COLORS.surface,
    },
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
