/**
 * JARDIN design tokens. Every colour, font, spacing value and motion timing lives here.
 * To change the gold, edit `gold.stops` (and optionally `gold.shine`). All gold
 * surfaces (logo, buttons, tab icons, badges, hairlines) read from it.
 */

export const colors = {
  ivory: '#FAF7F0', // app background (marble / moulding)
  champagne: '#EFE6D6', // surfaces (velvet panels)
  champagneDeep: '#E4D7C0',
  stone: '#D9CDB8',
  ink: '#0E0E0E', // text + solid buttons
  inkSoft: '#2A2723',
  muted: '#6B6358', // secondary text, 5.6:1 on ivory
  white: '#FFFFFF',
  black: '#0E0E0E',
  brass: '#B8903A', // flat fallback for gold when a gradient isn't possible
  sale: '#7A1F1F', // deep oxblood for sale price text (never bright red)
  overlay: 'rgba(14,14,14,0.45)',
  overlayLight: 'rgba(250,247,240,0.86)',
  whatsapp: '#1F7A4D',
} as const;

export const gold = {
  /** Multi-stop metallic gradient, dark → light → dark. */
  stops: ['#7A5C16', '#B8903A', '#E8D08A', '#FFF3C4', '#C9A44C', '#8A6A1F'] as const,
  locations: [0, 0.22, 0.45, 0.55, 0.78, 1] as const,
  /** The moving highlight band (transparent → white-gold → transparent). */
  shine: ['rgba(255,243,196,0)', 'rgba(255,250,232,0.85)', 'rgba(255,243,196,0)'] as const,
  /** Diagonal direction used by every gold surface. */
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;

export const fonts = {
  serif: 'CormorantGaramond_500Medium',
  serifLight: 'CormorantGaramond_400Regular',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  serifBold: 'CormorantGaramond_600SemiBold',
  sans: 'Jost_400Regular',
  sansLight: 'Jost_300Light',
  sansMedium: 'Jost_500Medium',
} as const;

export const type = {
  display: { fontFamily: fonts.serif, fontSize: 40, lineHeight: 44, color: colors.ink },
  h1: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 38, color: colors.ink },
  h2: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 32, color: colors.ink },
  h3: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 23, color: colors.ink },
  bodySmall: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, color: colors.muted },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase' as const,
    color: colors.ink,
  },
  labelSmall: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.muted,
  },
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 20,
} as const;

export const radii = {
  none: 0,
  sm: 2,
  md: 6,
  pill: 999,
} as const;

/** Minimum touch target (Apple HIG 44pt / Material 48dp). */
export const hitTarget = 48;

export const motion = {
  /** Slow, calm, expensive. */
  fast: 280,
  base: 520,
  slow: 900,
  shineSweep: 1500,
  shinePause: 2600, // sweep + pause ≈ 4.1 s
  splashHold: 600,
} as const;

export const theme = { colors, gold, fonts, type, spacing, radii, motion, hitTarget };
export type Theme = typeof theme;
export default theme;
