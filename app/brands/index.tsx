import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { T } from '../../components/ui/Typography';
import { repo } from '../../data/repository';
import type { Brand, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { useAsync } from '../../utils/useAsync';

export default function Brands() {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const gap = spacing.sm;
  const cols = width >= 700 ? 3 : 2;
  const tileW = Math.floor((width - spacing.gutter * 2 - gap * (cols - 1)) / cols);

  const { data } = useAsync(
    async () => {
      const [brands, products] = await Promise.all([repo.getBrands(), repo.getProducts()]);
      return { brands, products };
    },
    [],
    { brands: [] as Brand[], products: [] as Product[] },
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader title={t('brands.title')} back />
      <FlatList
        data={data.brands}
        key={cols}
        numColumns={cols}
        keyExtractor={(b) => b.id}
        columnWrapperStyle={{ gap, paddingHorizontal: spacing.gutter }}
        contentContainerStyle={{ gap, paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <T kind="labelSmall" style={{ padding: spacing.gutter, paddingBottom: spacing.xs }}>
            {t('brands.subtitle')}
          </T>
        }
        renderItem={({ item }) => {
          const count = data.products.filter((p) => p.brandId === item.id).length;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${t('common.items', { count })}${item.confirmed ? '' : `, ${t('common.toConfirm')}`}`}
              onPress={() => {
                tapLight();
                router.push(`/brands/${item.id}`);
              }}
              style={({ pressed }) => [{ width: tileW, height: tileW * 1.2 }, pressed && { opacity: 0.85 }]}
            >
              <Image source={img(item.image)} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
              <LinearGradient
                colors={['rgba(14,14,14,0)', 'rgba(14,14,14,0.72)']}
                locations={[0.45, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.caption}>
                <T kind="h3" style={{ color: colors.ivory }} numberOfLines={1}>
                  {item.name}
                </T>
                <T kind="labelSmall" style={{ color: colors.stone, fontSize: 9 }}>
                  {t('common.items', { count })}
                  {item.confirmed ? '' : ` · ${t('common.toConfirm')}`}
                </T>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { position: 'absolute', left: 12, right: 12, bottom: 12 },
});
