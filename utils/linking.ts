import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import config from '../config';

/** Opens a URL; falls back to `fallbackUrl`, then shows a friendly alert. */
export async function openUrl(url: string, fallbackUrl?: string, onFail?: () => void): Promise<boolean> {
  try {
    if (Platform.OS !== 'web' && fallbackUrl) {
      const can = await Linking.canOpenURL(url).catch(() => false);
      if (!can) {
        await Linking.openURL(fallbackUrl);
        return true;
      }
    }
    await Linking.openURL(url);
    return true;
  } catch {
    if (fallbackUrl) {
      try {
        await Linking.openURL(fallbackUrl);
        return true;
      } catch {
        /* fall through */
      }
    }
    onFail?.();
    return false;
  }
}

export function failAlert(message: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    globalThis.alert?.(message);
  } else {
    Alert.alert('JARDIN', message);
  }
}

export const callStore = (onFail?: () => void) => openUrl(`tel:${config.phone}`, undefined, onFail);

export const openInstagram = (onFail?: () => void) =>
  openUrl(Platform.OS === 'web' ? config.instagram.url : config.instagram.appUrl, config.instagram.url, onFail);

export function directionsUrl(): string {
  const { latitude, longitude } = config.coordinates;
  const label = encodeURIComponent(`JARDIN Luxury Boutique, ${config.address.full}`);
  if (Platform.OS === 'ios') return `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`;
  if (Platform.OS === 'android') return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

export const openDirections = (onFail?: () => void) =>
  openUrl(
    directionsUrl(),
    `https://www.google.com/maps/dir/?api=1&destination=${config.coordinates.latitude},${config.coordinates.longitude}`,
    onFail,
  );
