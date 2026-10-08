import { Platform } from 'react-native';
import config from '../config';
import { openUrl } from './linking';

/** Builds a wa.me link with a URL-encoded, prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${config.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Opens WhatsApp (app if installed, otherwise wa.me in the browser). */
export function openWhatsApp(message?: string, onFail?: () => void) {
  if (Platform.OS === 'web') return openUrl(whatsappUrl(message), undefined, onFail);
  const appUrl = `whatsapp://send?phone=${config.whatsapp}${message ? `&text=${encodeURIComponent(message)}` : ''}`;
  return openUrl(appUrl, whatsappUrl(message), onFail);
}
