import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Brand, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { success, tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { useWishlist } from '../../utils/wishlistStore';
import { Badge } from '../gold';
import { T } from '../ui/Typography';
import { Price } from './Price';

interface Props {
  product: Product;
  brand?: Brand;
  width: number;
}

/** Portrait 4:5 product tile: image, badge, heart, brand, name, price. */
export const ProductCard = memo(function ProductCard({ product, brand, width }: Props) {
  const { t } = useI18n();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);
  const brandName = brand?.name ?? product.brandId;

  return (
    <View style={{ width }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${brandName}, ${product.name}`}
        onPress={() => {
          tapLight();
          router.push(`/product/${product.id}`);
        }}
        style={({ pressed }) => [{ width }, pressed && { opacity: 0.85 }]}
      >
        <View style={[styles.imageWrap, { width, height: width * 1.25 }]}>
          <Image
            source={img(product.images[0])}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={400}
            accessibilityIgnoresInvertColors
          />
          <View style={styles.badges}>
            {product.onSale ? <Badge label={t('common.sale').toUpperCase()} /> : null}
            {product.isNew && !product.onSale ? <Badge label={t('common.new').toUpperCase()} tone="ink" /> : null}
          </View>
        </View>
        <View style={styles.meta}>
          <T kind="labelSmall" numberOfLines={1} style={{ color: colors.ink }}>
            {brandName}
          </T>
          <T kind="bodySmall" numberOfLines={2} style={styles.name}>
            {product.name}
          </T>
          <Price product={product} small />
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={saved ? t('wishlist.remove') : t('product.save')}
        accessibilityState={{ selected: saved }}
        hitSlop={8}
        onPress={() => {
          const nowSaved = wishlist.toggle(product.id);
          if (nowSaved) success();
          else tapLight();
        }}
        style={styles.heart}
      >
        <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={colors.ink} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  imageWrap: { backgroundColor: colors.champagne, overflow: 'hidden' },
  badges: { position: 'absolute', top: 10, left: 10, gap: 6 },
  heart: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlayLight,
  },
  meta: { paddingTop: spacing.sm, paddingBottom: spacing.xs, gap: 2 },
  name: { color: colors.inkSoft, minHeight: 38 },
});
