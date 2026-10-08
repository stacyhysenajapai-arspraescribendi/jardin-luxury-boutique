import type { ImageSource } from 'expo-image';
import { placeholderImages } from '../assets/placeholder';

/**
 * Resolves an image reference from the JSON data.
 *  - "https://…" → remote image (CDN, Supabase storage, etc.)
 *  - "bags-1"    → bundled placeholder in assets/placeholder
 */
export function img(ref: string | undefined | null): ImageSource | number | undefined {
  if (!ref) return undefined;
  if (/^https?:\/\//.test(ref)) return { uri: ref };
  return placeholderImages[ref];
}
