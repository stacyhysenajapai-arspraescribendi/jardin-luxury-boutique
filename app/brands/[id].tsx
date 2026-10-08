import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Ornament } from '../../components/gold';
import { ProductGrid } from '../../components/product/ProductGrid';
import { EmptyState } from '../../components/ui/EmptyState';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { T } from '../../components/ui/Typography';
import { repo } from '../../data/repository';
import type { Brand, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { useAsync } from '../../utils/useAsync';
import { openWhatsApp } from '../../utils/whatsapp';

export default function BrandProducts() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useI18n();

  const { data } = useAsync(
    async () => {
      const [brand, products, brands] = await Promise.all([
        repo.getBrand(id),
        repo.getProducts({ brandIds: [id] }),
        repo.getBrands(),
      ]);
      return { brand, products, brands };
    },
    [id],
    { brand: undefined as Brand | undefined, products: [] as Product[], brands: [] as Brand[] },
  );

  const name = data.brand?.name ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader title={name} back />
      <ProductGrid
        products={data.products}
        brands={data.brands}
        header={
          <View style={{ alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.gutter }}>
            <T kind="display" style={{ textAlign: 'center' }} accessibilityRole="header">
              {name}
            </T>
            {data.brand && !data.brand.confirmed ? (
              <T kind="labelSmall" style={{ marginTop: 6 }}>
                {t('common.toConfirm')}
              </T>
            ) : null}
            <Ornament style={{ marginVertical: spacing.md }} />
            <T kind="labelSmall">{t('common.items', { count: data.products.length })}</T>
          </View>
        }
        empty={
          <EmptyState
            icon="sparkles-outline"
            title={name}
            body={t('brands.empty')}
            actionLabel={t('product.askWhatsApp')}
            onAction={() => openWhatsApp(`Hello JARDIN, what do you have from ${name}?`)}
          />
        }
      />
    </View>
  );
}
