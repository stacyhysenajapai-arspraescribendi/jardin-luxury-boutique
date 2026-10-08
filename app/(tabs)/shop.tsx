import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ProductGrid } from '../../components/product/ProductGrid';
import { FilterSheet } from '../../components/shop/FilterSheet';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { T } from '../../components/ui/Typography';
import { countActiveFilters, filterProducts } from '../../data/filterProducts';
import { repo } from '../../data/repository';
import { CATEGORIES, type Brand, type Category, type Product, type ProductFilters } from '../../data/types';
import { translate, useI18n } from '../../i18n';
import { colors, fonts, hitTarget, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { useAsync } from '../../utils/useAsync';
import { openWhatsApp } from '../../utils/whatsapp';

type Params = { sale?: string; brand?: string; category?: string; new?: string; q?: string };

function filtersFromParams(p: Params): ProductFilters {
  return {
    query: p.q ?? '',
    saleOnly: p.sale === '1',
    newOnly: p.new === '1',
    brandIds: p.brand ? [p.brand] : [],
    categories: p.category && CATEGORIES.includes(p.category as Category) ? [p.category as Category] : [],
    sizes: [],
  };
}

/** Category labels in both languages so "çanta" and "bags" both find bags. */
const categoryLabels = Object.fromEntries(
  CATEGORIES.map((c) => [c, [translate('en', `categories.${c}`), translate('sq', `categories.${c}`)]]),
);

export default function Shop() {
  const { t } = useI18n();
  const params = useLocalSearchParams<Params>();
  const [filters, setFilters] = useState<ProductFilters>(() => filtersFromParams(params));
  const [sheet, setSheet] = useState(false);

  // Re-apply when navigated to with new params (e.g. from an offer or "Shop the sale").
  const paramKey = JSON.stringify([params.sale, params.brand, params.category, params.new, params.q]);
  useEffect(() => {
    setFilters(filtersFromParams(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey]);

  const { data } = useAsync(
    async () => {
      const [products, brands, sizes] = await Promise.all([repo.getProducts(), repo.getBrands(), repo.getAllSizes()]);
      return { products, brands, sizes };
    },
    [],
    { products: [] as Product[], brands: [] as Brand[], sizes: [] as string[] },
  );

  const run = (f: ProductFilters) => filterProducts(data.products, f, data.brands, categoryLabels);
  const results = useMemo(() => run(filters), [filters, data]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = countActiveFilters(filters);
  const brandName = (id: string) => data.brands.find((b) => b.id === id)?.name ?? id;

  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...(filters.saleOnly ? [{ key: 'sale', label: t('shop.saleOnly'), remove: () => setFilters((f) => ({ ...f, saleOnly: false })) }] : []),
    ...(filters.newOnly ? [{ key: 'new', label: t('home.newArrivals'), remove: () => setFilters((f) => ({ ...f, newOnly: false })) }] : []),
    ...(filters.categories ?? []).map((c) => ({
      key: `c-${c}`,
      label: t(`categories.${c}`),
      remove: () => setFilters((f) => ({ ...f, categories: f.categories?.filter((x) => x !== c) })),
    })),
    ...(filters.brandIds ?? []).map((b) => ({
      key: `b-${b}`,
      label: brandName(b),
      remove: () => setFilters((f) => ({ ...f, brandIds: f.brandIds?.filter((x) => x !== b) })),
    })),
    ...(filters.sizes ?? []).map((s) => ({
      key: `s-${s}`,
      label: `${t('shop.size')} ${s}`,
      remove: () => setFilters((f) => ({ ...f, sizes: f.sizes?.filter((x) => x !== s) })),
    })),
  ];

  const header = (
    <View>
      <View style={styles.searchRow}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            value={filters.query}
            onChangeText={(q) => setFilters((f) => ({ ...f, query: q }))}
            placeholder={t('shop.searchPlaceholder')}
            placeholderTextColor={colors.muted}
            style={styles.input}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel={t('shop.searchPlaceholder')}
            clearButtonMode="while-editing"
          />
          {filters.query ? (
            <Pressable
              onPress={() => setFilters((f) => ({ ...f, query: '' }))}
              accessibilityLabel={t('shop.clearAll')}
              hitSlop={10}
            >
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          onPress={() => {
            tapLight();
            setSheet(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t('shop.filters')}${active ? ` (${active})` : ''}`}
          style={({ pressed }) => [styles.filterBtn, active > 0 && styles.filterBtnActive, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="options-outline" size={18} color={active ? colors.ivory : colors.ink} />
          {active > 0 && <T style={styles.filterCount}>{active}</T>}
        </Pressable>
      </View>

      {/* Quick category rail */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRail}>
        {CATEGORIES.map((c) => {
          const on = filters.categories?.includes(c);
          return (
            <Pressable
              key={c}
              onPress={() => {
                tapLight();
                setFilters((f) => ({ ...f, categories: on ? f.categories?.filter((x) => x !== c) : [c] }));
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: !!on }}
              style={styles.catItem}
            >
              <T kind="label" style={[{ fontSize: 10.5 }, !on && { color: colors.muted }]}>
                {t(`categories.${c}`)}
              </T>
              <View style={[styles.catUnderline, on && { backgroundColor: colors.ink }]} />
            </Pressable>
          );
        })}
      </ScrollView>

      {activeChips.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeRow}>
          {activeChips.map((c) => (
            <Pressable
              key={c.key}
              onPress={c.remove}
              accessibilityRole="button"
              accessibilityLabel={`${c.label}, remove`}
              style={styles.activeChip}
            >
              <T style={styles.activeChipText}>{c.label}</T>
              <Ionicons name="close" size={13} color={colors.ink} />
            </Pressable>
          ))}
          <Pressable onPress={() => setFilters({ query: filters.query })} style={styles.clear} accessibilityRole="button">
            <T kind="labelSmall" style={{ textDecorationLine: 'underline' }}>
              {t('shop.clearAll')}
            </T>
          </Pressable>
        </ScrollView>
      )}

      <T kind="labelSmall" style={styles.count}>
        {t('shop.results', { count: results.length })}
      </T>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader
        title={t('shop.title')}
        right={
          <Pressable onPress={() => router.push('/brands')} accessibilityRole="link" style={styles.brandsLink} hitSlop={6}>
            <T kind="labelSmall" style={{ color: colors.ink }}>
              {t('brands.title')}
            </T>
          </Pressable>
        }
      />
      <ProductGrid
        products={results}
        brands={data.brands}
        header={header}
        empty={
          <EmptyState
            icon="search-outline"
            title={t('shop.noResults')}
            body={t('shop.noResultsHint')}
            actionLabel={t('product.askWhatsApp')}
            onAction={() => openWhatsApp(filters.query ? `Hello JARDIN, I'm looking for: ${filters.query}` : undefined)}
          />
        }
      />
      <FilterSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        value={filters}
        onApply={setFilters}
        brands={data.brands}
        sizes={data.sizes}
        countFor={(f) => run(f).length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.gutter, paddingTop: spacing.md },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: hitTarget,
    paddingHorizontal: 14,
    backgroundColor: colors.champagne,
  },
  input: { flex: 1, height: hitTarget, fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
  filterBtn: {
    width: hitTarget,
    height: hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.stone,
    flexDirection: 'row',
    gap: 2,
  },
  filterBtnActive: { backgroundColor: colors.ink, borderColor: colors.ink, width: hitTarget + 10 },
  filterCount: { color: colors.ivory, fontFamily: fonts.sansMedium, fontSize: 11 },
  catRail: { paddingHorizontal: spacing.gutter - 6, paddingTop: spacing.sm },
  catItem: { paddingHorizontal: 6, minHeight: hitTarget, justifyContent: 'center', marginRight: spacing.sm },
  catUnderline: { height: 1, marginTop: 6, backgroundColor: 'transparent' },
  activeRow: { paddingHorizontal: spacing.gutter, gap: spacing.xs, alignItems: 'center', paddingTop: spacing.xs },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    backgroundColor: colors.champagne,
  },
  activeChipText: { fontFamily: fonts.sans, fontSize: 12, color: colors.ink },
  clear: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  count: { paddingHorizontal: spacing.gutter, paddingTop: spacing.md, paddingBottom: spacing.md },
  brandsLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
});
