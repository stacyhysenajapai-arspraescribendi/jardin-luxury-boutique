import type { Brand, Product, ProductFilters } from './types';

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and');

/** Pure, synchronous filtering. Used by the local repository and by the Shop screen. */
export function filterProducts(
  products: Product[],
  filters: ProductFilters = {},
  brands: Brand[] = [],
  /** Extra searchable words per category (e.g. translated labels). */
  categoryLabels: Partial<Record<string, string[]>> = {},
): Product[] {
  const brandName = new Map(brands.map((b) => [b.id, b.name]));
  const terms = filters.query ? normalize(filters.query).split(/\s+/).filter(Boolean) : [];

  return products.filter((p) => {
    if (filters.saleOnly && !p.onSale) return false;
    if (filters.newOnly && !p.isNew) return false;
    if (filters.categories?.length && !filters.categories.includes(p.category)) return false;
    if (filters.brandIds?.length && !filters.brandIds.includes(p.brandId)) return false;
    if (filters.sizes?.length && !p.sizes.some((s) => filters.sizes!.includes(s))) return false;
    if (terms.length) {
      const haystack = normalize(
        [
          p.name,
          brandName.get(p.brandId) ?? p.brandId,
          p.category,
          ...(categoryLabels[p.category] ?? []),
          p.description,
          ...(p.colors ?? []),
        ].join(' '),
      );
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });
}

/** Sizes sorted: letter sizes first in garment order, then numeric ascending, then the rest. */
export function sortSizes(sizes: string[]): string[] {
  const letters = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  return [...new Set(sizes)].sort((a, b) => {
    const la = letters.indexOf(a);
    const lb = letters.indexOf(b);
    if (la !== -1 || lb !== -1) return (la === -1 ? 99 : la) - (lb === -1 ? 99 : lb);
    const na = Number(a);
    const nb = Number(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    if (!isNaN(na)) return -1;
    if (!isNaN(nb)) return 1;
    return a.localeCompare(b);
  });
}

export function countActiveFilters(f: ProductFilters): number {
  return (f.categories?.length ?? 0) + (f.brandIds?.length ?? 0) + (f.sizes?.length ?? 0) + (f.saleOnly ? 1 : 0) + (f.newOnly ? 1 : 0);
}
