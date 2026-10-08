import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Hairline } from '../../components/gold';
import { Price } from '../../components/product/Price';
import { ZoomableImage } from '../../components/product/ZoomableImage';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { FadeIn } from '../../components/ui/FadeIn';
import { IconButton } from '../../components/ui/IconButton';
import { T } from '../../components/ui/Typography';
import { repo } from '../../data/repository';
import type { Brand, Look, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, fonts, spacing } from '../../theme/theme';
import { success, tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { failAlert } from '../../utils/linking';
import config from '../../config';
import { useAsync } from '../../utils/useAsync';
import { openWhatsApp } from '../../utils/whatsapp';
import { useWishlist } from '../../utils/wishlistStore';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wishlist = useWishlist();
  const [page, setPage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const { data, loading } = useAsync(
    async () => {
      const product = await repo.getProduct(id);
      const brand = product ? await repo.getBrand(product.brandId) : undefined;
      const looks = (await repo.getLooks()).filter((l) => l.products.some((x) => x.productId === id));
      return { product, brand, looks };
    },
    [id],
    { product: undefined as Product | undefined, brand: undefined as Brand | undefined, looks: [] as Look[] },
  );

  const { product, brand, looks } = data;
  if (!product) {
    return (
      <View style={[styles.fill, { paddingTop: insets.top }]}>
        <IconButton name="chevron-back" label={t('common.back')} onPress={() => router.back()} />
        {!loading && <EmptyState icon="sparkles-outline" title={t('product.notFound')} actionLabel={t('wishlist.browse')} onAction={() => router.replace('/shop')} />}
      </View>
    );
  }

  const oneSize = product.sizes.length === 1;
  const chosenSize = oneSize ? product.sizes[0] : size;
  const saved = wishlist.has(product.id);
  const galleryH = Math.round(width * 1.25);
  const brandName = brand?.name ?? product.brandId;

  const message = (key: 'product.waAsk' | 'product.waReserve') =>
    t(key, {
      brand: brandName,
      name: product.name,
      size: chosenSize && chosenSize !== 'One size' ? t('product.waSize', { size: chosenSize }) : '',
    });

  const contact = (key: 'product.waAsk' | 'product.waReserve') => {
    // Asking about price is fine without a size; reserving needs one.
    if (key === 'product.waReserve' && !chosenSize) {
      setSizeError(true);
      tapLight();
      return;
    }
    openWhatsApp(message(key), () => failAlert(t('common.couldNotOpen', { app: 'WhatsApp', phone: config.phoneDisplay })));
  };

  return (
    <View style={styles.fill}>
      <ScrollView scrollEnabled={!zoomed} contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}>
        {/* Gallery */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled={!zoomed}
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
            scrollEventThrottle={32}
          >
            {product.images.map((ref, i) => (
              <ZoomableImage
                key={`${ref}-${i}`}
                source={img(ref)}
                width={width}
                height={galleryH}
                onZoomChange={setZoomed}
                accessibilityLabel={`${brandName} ${product.name}, ${i + 1}/${product.images.length}`}
              />
            ))}
          </ScrollView>
          <View style={styles.galleryFooter} pointerEvents="none">
            <View style={styles.dots}>
              {product.images.length > 1 &&
                product.images.map((_, i) => <View key={i} style={[styles.dot, i === page && styles.dotOn]} />)}
            </View>
            <T kind="labelSmall" style={{ fontSize: 9 }}>
              {t('product.zoomHint')}
            </T>
          </View>
          <View style={[styles.topBar, { top: insets.top + 4 }]}>
            <IconButton
              name="chevron-back"
              label={t('common.back')}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/shop'))}
              background={colors.overlayLight}
            />
            <View style={styles.badges}>
              {product.onSale ? <Badge label={t('common.sale').toUpperCase()} /> : null}
              {product.isNew ? <Badge label={t('common.new').toUpperCase()} tone="ink" /> : null}
            </View>
          </View>
        </View>

        {/* Info */}
        <FadeIn style={styles.info}>
          <Pressable onPress={() => brand && router.push(`/brands/${brand.id}`)} accessibilityRole="link" hitSlop={8}>
            <T kind="label" style={{ letterSpacing: 3 }}>
              {brandName}
              {brand && !brand.confirmed ? ` · ${t('common.toConfirm')}` : ''}
            </T>
          </Pressable>
          <T kind="h1" style={{ marginTop: 6 }} accessibilityRole="header">
            {product.name}
          </T>
          <View style={{ marginTop: spacing.sm }}>
            <Price product={product} />
          </View>

          <Hairline style={{ marginVertical: spacing.lg, opacity: 0.6 }} />

          {/* Sizes */}
          <View style={styles.rowBetween}>
            <T kind="label">{t('product.size')}</T>
            {!oneSize && !chosenSize ? (
              <T kind="labelSmall" style={sizeError ? { color: colors.sale } : undefined}>
                {t('product.selectSize')}
              </T>
            ) : null}
          </View>
          <View style={styles.sizes}>
            {product.sizes.map((s) => (
              <Chip
                key={s}
                label={s === 'One size' ? t('product.oneSize') : s}
                selected={chosenSize === s}
                onPress={() => {
                  setSize(s);
                  setSizeError(false);
                }}
              />
            ))}
          </View>

          {product.colors?.length ? (
            <View style={{ marginTop: spacing.md }}>
              <T kind="label">{t('product.colors')}</T>
              <T kind="body" style={{ marginTop: 6, color: colors.inkSoft }}>
                {product.colors.join(' · ')}
              </T>
            </View>
          ) : null}

          <T kind="label" style={{ marginTop: spacing.lg }}>
            {t('product.details')}
          </T>
          <T kind="body" style={{ marginTop: 6, color: colors.inkSoft }}>
            {product.description}
          </T>
          <T kind="labelSmall" style={{ marginTop: spacing.sm, textTransform: 'none', letterSpacing: 0.5 }}>
            {t(`categories.${product.category}`)}
          </T>

          {product.placeholder ? (
            <View style={styles.note}>
              <Ionicons name="information-circle-outline" size={16} color={colors.muted} />
              <T kind="bodySmall" style={{ flex: 1 }}>
                {t('product.placeholderNote')}
              </T>
            </View>
          ) : null}

          {looks.length > 0 ? (
            <View style={{ marginTop: spacing.lg }}>
              <T kind="label">{t('product.inLooks')}</T>
              {looks.map((l) => (
                <Pressable
                  key={l.id}
                  onPress={() => router.push({ pathname: '/looks', params: { start: l.id } })}
                  accessibilityRole="link"
                  style={styles.lookLink}
                >
                  <Ionicons name="play-circle-outline" size={20} color={colors.ink} />
                  <T kind="h3" style={{ flex: 1 }}>
                    {l.title}
                  </T>
                  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </Pressable>
              ))}
            </View>
          ) : null}
        </FadeIn>
      </ScrollView>

      {/* Sticky actions */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? t('wishlist.remove') : t('product.save')}
          accessibilityState={{ selected: saved }}
          onPress={() => {
            const now = wishlist.toggle(product.id);
            if (now) success();
            else tapLight();
          }}
          style={({ pressed }) => [styles.save, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={colors.ink} />
          <T style={styles.saveText}>{saved ? t('product.saved') : t('product.save')}</T>
        </Pressable>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Button label={t('product.askWhatsApp')} icon="logo-whatsapp" onPress={() => contact('product.waAsk')} compact />
          <Button label={t('product.reserve')} variant="ink" icon="calendar-outline" onPress={() => contact('product.waReserve')} compact />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ivory },
  topBar: {
    position: 'absolute',
    left: spacing.xs,
    right: spacing.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: { flexDirection: 'row', gap: 6 },
  galleryFooter: {
    position: 'absolute',
    bottom: 12,
    left: spacing.gutter,
    right: spacing.gutter,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(14,14,14,0.25)' },
  dotOn: { backgroundColor: colors.ink, width: 18 },
  info: { paddingHorizontal: spacing.gutter, paddingTop: spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sizes: { flexDirection: 'row', flexWrap: 'wrap' },
  note: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.lg,
    padding: spacing.sm,
    backgroundColor: colors.champagne,
    alignItems: 'flex-start',
  },
  lookLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stone,
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    backgroundColor: colors.ivory,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stone,
  },
  save: { width: 58, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.stone },
  saveText: { fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.4, marginTop: 4, textTransform: 'uppercase', color: colors.ink },
});
