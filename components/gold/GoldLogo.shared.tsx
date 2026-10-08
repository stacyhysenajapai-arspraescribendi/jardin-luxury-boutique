import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme/theme';

export type LogoVariant = 'splash' | 'header';
export type ShineMode = 'loop' | 'once' | 'off';

export interface GoldLogoProps {
  variant?: LogoVariant;
  /** Default: header → loop, splash → once */
  shine?: ShineMode;
  /** Very subtle sparkle at the end of each sweep. */
  sparkle?: boolean;
  /** ms before the first sweep starts. */
  delay?: number;
  /** Called after a `once` sweep finishes. */
  onShineEnd?: () => void;
  accessibilityLabel?: string;
}

export const LOGO_SIZES = {
  splash: { title: 48, titleSpacing: 16, sub: 10.5, subSpacing: 6.5, gap: 6 },
  header: { title: 25, titleSpacing: 9, sub: 7, subSpacing: 3.6, gap: 1 },
} as const;

export const logoStyles = (variant: LogoVariant) => {
  const s = LOGO_SIZES[variant];
  return StyleSheet.create({
    wrap: { alignItems: 'center', justifyContent: 'center' },
    title: {
      fontFamily: fonts.serif,
      fontSize: s.title,
      lineHeight: s.title * 1.12,
      letterSpacing: s.titleSpacing,
      // letterSpacing adds trailing space after the last glyph; offset it to stay optically centred
      paddingLeft: s.titleSpacing,
      color: colors.black,
      textAlign: 'center',
      includeFontPadding: false,
    },
    sub: {
      fontFamily: fonts.sansMedium,
      fontSize: s.sub,
      letterSpacing: s.subSpacing,
      paddingLeft: s.subSpacing,
      marginTop: s.gap,
      color: colors.black,
      textAlign: 'center',
      includeFontPadding: false,
    },
  });
};
