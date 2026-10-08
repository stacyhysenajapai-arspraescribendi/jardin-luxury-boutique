import React, { useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { Brand, Product } from '../../data/types';
import { spacing } from '../../theme/theme';
import { ProductCard } from './ProductCard';

/** Two-column (three on tablets) product grid. */
export function ProductGrid({
  products,
  brands,
  header,
  empty,
  footer,
}: {
  products: Product[];
  brands: Brand[];
  header?: React.ReactElement | null;
  empty?: React.ReactElement | null;
  footer?: React.ReactElement | null;
}) {
  const { width } = useWindowDimensions();
  const cols = width >= 700 ? 3 : 2;
  const gap = spacing.md;
  const cardW = Math.floor((width - spacing.gutter * 2 - gap * (cols - 1)) / cols);
  const brandMap = useMemo(() => new Map(brands.map((b) => [b.id, b])), [brands]);

  const render: ListRenderItem<Product> = ({ item }) => (
    <ProductCard product={item} brand={brandMap.get(item.brandId)} width={cardW} />
  );

  return (
    <FlatList
      key={cols}
      data={products}
      keyExtractor={(p) => p.id}
      numColumns={cols}
      renderItem={render}
      columnWrapperStyle={{ gap, paddingHorizontal: spacing.gutter }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={footer}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      initialNumToRender={8}
      windowSize={7}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({ list: { flex: 1 } });
