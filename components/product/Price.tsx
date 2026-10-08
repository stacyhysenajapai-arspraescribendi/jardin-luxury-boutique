import React from 'react';
import { Text, View } from 'react-native';
import type { Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, fonts } from '../../theme/theme';
import { formatPrice } from '../../utils/format';

/** "Price on request" by default. Shows a price only when the JSON provides one. */
export function Price({ product, small }: { product: Product; small?: boolean }) {
  const { t, locale } = useI18n();
  const size = small ? 13 : 16;
  if (product.price == null) {
    return (
      <Text style={{ fontFamily: fonts.serifItalic, fontSize: size + 1, color: colors.muted }}>
        {t('common.priceOnRequest')}
      </Text>
    );
  }
  const cur = product.currency;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text style={{ fontFamily: fonts.sansMedium, fontSize: size, color: product.onSale ? colors.sale : colors.ink }}>
        {formatPrice(product.price, cur, locale)}
      </Text>
      {product.compareAtPrice ? (
        <Text style={{ fontFamily: fonts.sans, fontSize: size - 2, color: colors.muted, textDecorationLine: 'line-through' }}>
          {formatPrice(product.compareAtPrice, cur, locale)}
        </Text>
      ) : null}
    </View>
  );
}
