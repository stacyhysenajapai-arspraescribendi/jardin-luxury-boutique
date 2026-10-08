/**
 * Data access layer. Screens only talk to `repo` (never to the JSON files directly),
 * so swapping local JSON for Supabase / Firebase means writing one new class that
 * implements `CatalogRepository` and changing the export at the bottom.
 */
import type { Brand, Look, Offer, Product, ProductFilters } from './types';
import { LocalRepository } from './localRepository';

export interface CatalogRepository {
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getLooks(): Promise<Look[]>;
  /** Offers whose validity window contains `now`. */
  getActiveOffers(now?: Date): Promise<Offer[]>;
  /** Offers that start after `now`. */
  getUpcomingOffers(now?: Date): Promise<Offer[]>;
  /** All sizes present in the catalog (for the filter sheet). */
  getAllSizes(): Promise<string[]>;
}

export const repo: CatalogRepository = new LocalRepository();
