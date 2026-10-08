import { useIsFocused, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, ViewToken, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoldLogo } from '../../components/gold';
import { ReelItem } from '../../components/looks/ReelItem';
import { T } from '../../components/ui/Typography';
import { repo } from '../../data/repository';
import type { Brand, Look, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { useAsync } from '../../utils/useAsync';

/** Vertical, full-height reel feed. Only the visible look plays. */
export default function Looks() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { start } = useLocalSearchParams<{ start?: string }>();
  const focused = useIsFocused();
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const listRef = useRef<FlatList<Look>>(null);

  const { data } = useAsync(
    async () => {
      const [looks, products, brands] = await Promise.all([repo.getLooks(), repo.getProducts(), repo.getBrands()]);
      return { looks, products, brands };
    },
    [],
    { looks: [] as Look[], products: [] as Product[], brands: [] as Brand[] },
  );

  const productMap = useMemo(() => new Map(data.products.map((p) => [p.id, p])), [data.products]);
  const brandMap = useMemo(() => new Map(data.brands.map((b) => [b.id, b])), [data.brands]);

  // Jump to a look when opened from Home / product page.
  useEffect(() => {
    if (!start || !height || !data.looks.length) return;
    const i = data.looks.findIndex((l) => l.id === start);
    if (i >= 0) {
      listRef.current?.scrollToOffset({ offset: i * height, animated: false });
      setActiveIndex(i);
    }
  }, [start, height, data.looks]);

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => v.isViewable);
    if (first?.index != null) setActiveIndex(first.index);
  }).current;

  const render = useCallback(
    ({ item, index }: { item: Look; index: number }) => (
      <ReelItem
        look={item}
        products={item.products.map((x) => productMap.get(x.productId)).filter((p): p is Product => !!p)}
        brands={brandMap}
        width={width}
        height={height}
        active={focused && index === activeIndex}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        bottomInset={0}
      />
    ),
    [productMap, brandMap, width, height, focused, activeIndex, muted],
  );

  return (
    <View style={styles.fill} onLayout={(e) => setHeight(Math.round(e.nativeEvent.layout.height))}>
      {focused && <StatusBar style="light" />}
      {height > 0 && (
        <FlatList
          ref={listRef}
          data={data.looks}
          keyExtractor={(l) => l.id}
          renderItem={render}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          windowSize={3}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          removeClippedSubviews
        />
      )}
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]} pointerEvents="none">
        <GoldLogo variant="header" sparkle={false} />
        <T kind="labelSmall" style={{ color: colors.stone, marginTop: 6 }}>
          {t('looks.title')} · {t('looks.subtitle')}
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.black },
  header: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
});
