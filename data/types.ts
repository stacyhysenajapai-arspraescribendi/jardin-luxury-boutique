/** Domain types. Keep these stable: a remote backend (Supabase/Firebase) should map onto them. */

export type Category =
  | 'ready-to-wear'
  | 'bags'
  | 'shoes'
  | 'hats'
  | 'jewelry'
  | 'swimwear'
  | 'accessories';

export const CATEGORIES: Category[] = [
  'ready-to-wear',
  'bags',
  'shoes',
  'hats',
  'jewelry',
  'swimwear',
  'accessories',
];

export type Gender = 'women' | 'men' | 'unisex';

export interface Brand {
  id: string;
  name: string;
  /** false = seen in store but not yet confirmed by JARDIN. */
  confirmed: boolean;
  /** Short mark shown inside the brand circle when no logo image is provided. */
  monogram: string;
  image: string; // key into assets/placeholder registry (or a remote URL)
  order: number;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  category: Category;
  gender: Gender;
  /** null = "Price on request" */
  price: number | null;
  /** Original price when on sale (optional). */
  compareAtPrice?: number | null;
  currency?: string;
  sizes: string[];
  colors?: string[];
  description: string;
  images: string[];
  isNew: boolean;
  onSale: boolean;
  /** Placeholder content that must be replaced with real data. */
  placeholder: boolean;
  createdAt: string; // ISO date
}

export interface LookItem {
  productId: string;
  label?: string;
}

export interface Look {
  id: string;
  title: string;
  stylist?: string;
  /** Remote URL or key in the video registry. Empty = poster only ("video coming soon"). */
  videoUrl: string | null;
  poster: string;
  products: LookItem[];
  placeholder: boolean;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  /** "black" = black + gold poster, "cream" = cream + gold poster */
  style: 'black' | 'cream';
  badge?: string; // e.g. "UP TO 70%"
  validFrom: string; // ISO date
  validTo: string; // ISO date
  image?: string;
  /** Optional shop filter applied when the offer is tapped. */
  link?: { saleOnly?: boolean; brandId?: string; category?: Category };
  showInHero: boolean;
  placeholder: boolean;
}

export interface ProductFilters {
  query?: string;
  categories?: Category[];
  brandIds?: string[];
  sizes?: string[];
  saleOnly?: boolean;
  newOnly?: boolean;
}
