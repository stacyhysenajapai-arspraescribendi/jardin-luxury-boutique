import { router } from 'expo-router';
import type { Offer } from '../data/types';

/** Opens the Shop tab pre-filtered according to an offer's `link`. */
export function openOffer(o: Offer) {
  const l = o.link ?? {};
  const params: Record<string, string> = {};
  if (l.saleOnly) params.sale = '1';
  if (l.brandId) params.brand = l.brandId;
  if (l.category) params.category = l.category;
  router.push({ pathname: '/shop', params });
}
