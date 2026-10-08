/**
 * Store details. Edit this file to update contact info shown across the app.
 * Values marked TODO are placeholders. JARDIN has not published them yet.
 */
import type { ImageSourcePropType } from 'react-native';

export const config = {
  storeName: 'JARDIN',
  storeTagline: 'LUXURY BOUTIQUE',

  address: {
    street: 'Rruga Brigada e VIII',
    district: 'Bllok',
    city: 'Tiranë',
    country: 'Albania',
    /** Full address as written locally (always shown in Albanian). */
    full: 'Rruga Brigada e VIII, Bllok, Tiranë, Shqipëri',
  },

  /** TODO: confirm the exact pin. This is an approximation on Rruga Brigada e VIII, Bllok. */
  coordinates: { latitude: 41.3189, longitude: 19.8186 },

  phone: '+355698637620',
  phoneDisplay: '+355 69 863 7620',
  /** Digits only, international format, no "+" (used for wa.me links). */
  whatsapp: '355698637620',

  instagram: {
    handle: 'jardin_luxury_boutique',
    url: 'https://www.instagram.com/jardin_luxury_boutique/',
    appUrl: 'instagram://user?username=jardin_luxury_boutique',
  },

  /** TODO: placeholders until the store confirms. */
  email: 'info@example.com', // TODO
  website: '', // TODO, leave empty to hide
  /** TODO: opening hours. `null` = shows "To be confirmed". Times in 24h. */
  hours: [
    { day: 'mon', open: null as string | null, close: null as string | null },
    { day: 'tue', open: null, close: null },
    { day: 'wed', open: null, close: null },
    { day: 'thu', open: null, close: null },
    { day: 'fri', open: null, close: null },
    { day: 'sat', open: null, close: null },
    { day: 'sun', open: null, close: null },
  ] as { day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; open: string | null; close: string | null }[],

  /**
   * Logo artwork. When you add `reference/logo.png` (white or black shapes on a
   * transparent background), replace `null` with: require('./reference/logo.png')
   * The gold gradient + shine will then be masked by your artwork instead of text.
   */
  logoImage: null as ImageSourcePropType | null,
  /** Aspect ratio (width / height) of the logo image, used when logoImage is set. */
  logoAspectRatio: 3.2,

  /** Currency for optional prices. */
  currency: 'EUR',
  defaultLanguage: 'en' as 'en' | 'sq',
} as const;

export default config;
