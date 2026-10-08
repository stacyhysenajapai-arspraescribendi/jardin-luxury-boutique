import brandsJson from './brands.json';
import looksJson from './looks.json';
import offersJson from './offers.json';
import productsJson from './products.json';
import { filterProducts, sortSizes } from './filterProducts';
import type { CatalogRepository } from './repository';
import type { Brand, Look, Offer, Product, ProductFilters } from './types';

const brands = (brandsJson as Brand[]).slice().sort((a, b) => a.order - b.order);
const products = productsJson as Product[];
const looks = looksJson as Look[];
const offers = offersJson as Offer[];

const startOfDay = (iso: string) => new Date(`${iso}T00:00:00`);
const endOfDay = (iso: string) => new Date(`${iso}T23:59:59`);

/** Reads the bundled JSON files. Async so the API matches a future remote backend. */
export class LocalRepository implements CatalogRepository {
  async getBrands() {
    return brands;
  }
  async getBrand(id: string) {
    return brands.find((b) => b.id === id);
  }
  async getProducts(filters?: ProductFilters) {
    return filterProducts(products, filters, brands);
  }
  async getProduct(id: string) {
    return products.find((p) => p.id === id);
  }
  async getProductsByIds(ids: string[]) {
    return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);
  }
  async getNewArrivals(limit = 10) {
    return products
      .filter((p) => p.isNew)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
  async getLooks() {
    return looks;
  }
  async getActiveOffers(now = new Date()) {
    return offers.filter((o) => startOfDay(o.validFrom) <= now && now <= endOfDay(o.validTo));
  }
  async getUpcomingOffers(now = new Date()) {
    return offers
      .filter((o) => startOfDay(o.validFrom) > now)
      .sort((a, b) => a.validFrom.localeCompare(b.validFrom));
  }
  async getAllSizes() {
    return sortSizes(products.flatMap((p) => p.sizes).filter((s) => s !== 'One size'));
  }
}
