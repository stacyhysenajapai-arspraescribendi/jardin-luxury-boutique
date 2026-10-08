import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { T } from '../../components/ui/Typography';
import config from '../../config';
import { repo } from '../../data/repository';
import type { Brand, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { failAlert } from '../../utils/linking';
import { useAsync } from '../../utils/useAsync';
import { openWhatsApp } from '../../utils/whatsapp';
import { useWishlist } from '../../utils/wishlistStore';

export default function Wishlist() {
  const { t } = useI18n();
  const { ids } = useWishlist();
  const key = ids.join(',');

  const { data } = useAsync(
    async () => {
      const [products, brands] = await Promise.all([repo.getProductsByIds(ids), repo.getBrands()]);
      return { products, brands };
    },
    [key],
    { products: [] as Product[], brands: [] as Brand[] },
  );

  const askAll = () => {
    const list = data.products
      .map((p) => `• ${data.brands.find((b) => b.id === p.brandId)?.name ?? ''} ${p.name}`)
      .join('\n');
    openWhatsApp(t('wishlist.waAll', { list }), () =>
      failAlert(t('common.couldNotOpen', { app: 'WhatsApp', phone: config.phoneDisplay })),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader title={t('wishlist.title')} />
      <ProductGrid
        products={data.products}
        brands={data.brands}
        header={
          data.products.length ? (
            <T kind="labelSmall" style={{ padding: spacing.gutter, paddingBottom: spacing.md }}>
              {t('common.items', { count: data.products.length })}
            </T>
          ) : null
        }
        empty={
          <EmptyState
            icon="heart-outline"
            title={t('wishlist.empty')}
            body={t('wishlist.emptyHint')}
            actionLabel={t('wishlist.browse')}
            onAction={() => router.push('/shop')}
          />
        }
        footer={
          data.products.length ? (
            <View style={{ paddingHorizontal: spacing.gutter, paddingTop: spacing.lg }}>
              <Button label={t('wishlist.askAll')} icon="logo-whatsapp" onPress={askAll} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
