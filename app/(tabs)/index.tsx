import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { BrandCircle } from '../../components/brand/BrandCircle';
import { GoldGradient, Hairline, Ornament } from '../../components/gold';
import { HeroCarousel } from '../../components/home/HeroCarousel';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import { IconButton } from '../../components/ui/IconButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { T } from '../../components/ui/Typography';
import config from '../../config';
import { repo } from '../../data/repository';
import type { Brand, Look, Offer, Product } from '../../data/types';
import { openOffer } from '../../utils/navigation';
import { useI18n } from '../../i18n';
import { colors, fonts, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { useAsync } from '../../utils/useAsync';

export default function Home() {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({ onScroll: (e) => (scrollY.value = e.contentOffset.y) });

  const { data } = useAsync(
    async () => {
      const [brands, offers, arrivals, looks, products] = await Promise.all([
        repo.getBrands(),
        repo.getActiveOffers(),
        repo.getNewArrivals(10),
        repo.getLooks(),
        repo.getProducts(),
      ]);
      return { brands, offers, arrivals, looks, products };
    },
    [],
    { brands: [] as Brand[], offers: [] as Offer[], arrivals: [] as Product[], looks: [] as Look[], products: [] as Product[] },
  );

  const brandMap = useMemo(() => new Map(data.brands.map((b) => [b.id, b])), [data.brands]);
  const heroOffers = data.offers.filter((o) => o.showInHero);
  const saleOffer = data.offers.find((o) => o.style === 'black' && o.link?.saleOnly);
  const cardW = Math.min(200, Math.round(width * 0.46));
  const lookW = Math.min(170, Math.round(width * 0.4));

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader
        logo
        right={<IconButton name="globe-outline" label={t('common.settings')} onPress={() => router.push('/settings')} />}
      />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {heroOffers.length > 0 && <HeroCarousel offers={heroOffers} onPressOffer={openOffer} scrollY={scrollY} />}

        {/* Brands, like the Instagram highlights */}
        <FadeIn delay={150} style={styles.section}>
          <SectionHeader
            title={t('home.brands')}
            actionLabel={t('home.allBrands')}
            onAction={() => router.push('/brands')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
            {data.brands.map((b) => (
              <BrandCircle key={b.id} brand={b} />
            ))}
          </ScrollView>
        </FadeIn>

        <Hairline inset={spacing.gutter} style={{ opacity: 0.5 }} />

        {/* New arrivals */}
        <FadeIn delay={250} style={styles.section}>
          <SectionHeader
            eyebrow={t('common.items', { count: data.arrivals.length })}
            title={t('home.newArrivals')}
            actionLabel={t('common.seeAll')}
            onAction={() => router.push({ pathname: '/shop', params: { new: '1' } })}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.hRow, { gap: spacing.md }]}>
            {data.arrivals.map((p) => (
              <ProductCard key={p.id} product={p} brand={brandMap.get(p.brandId)} width={cardW} />
            ))}
          </ScrollView>
        </FadeIn>

        {/* Shop the look */}
        <View style={[styles.section, styles.looksBlock]}>
          <SectionHeader
            title={t('home.shopTheLook')}
            eyebrow={t('looks.subtitle')}
            actionLabel={t('common.seeAll')}
            onAction={() => router.push('/looks')}
            dark
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.hRow, { gap: spacing.sm }]}>
            {data.looks.map((l) => (
              <Pressable
                key={l.id}
                accessibilityRole="button"
                accessibilityLabel={`${t('home.shopTheLook')}: ${l.title}`}
                onPress={() => {
                  tapLight();
                  router.push({ pathname: '/looks', params: { start: l.id } });
                }}
                style={({ pressed }) => [{ width: lookW }, pressed && { opacity: 0.85 }]}
              >
                <View style={{ width: lookW, height: lookW * (16 / 9), backgroundColor: colors.inkSoft }}>
                  <Image source={img(l.poster)} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
                  <View style={styles.playBadge}>
                    <T kind="labelSmall" style={{ color: colors.ivory, fontSize: 9 }}>
                      ▶ {t('looks.pieces', { count: l.products.length })}
                    </T>
                  </View>
                </View>
                <T kind="h3" style={{ color: colors.ivory, marginTop: spacing.xs }} numberOfLines={1}>
                  {l.title}
                </T>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Sale banner, black & gold like the in-store posters */}
        <FadeIn style={[styles.sale]}>
          <GoldGradient style={styles.saleFrame}>
            <View style={styles.saleInner}>
              <T kind="labelSmall" style={{ color: colors.stone, textAlign: 'center' }}>
                JARDIN · {config.address.district.toUpperCase()}
              </T>
              <T style={styles.saleTitle}>{t('home.saleTitle')}</T>
              {saleOffer?.badge ? (
                <GoldGradient style={styles.saleBadge}>
                  <T style={styles.saleBadgeText}>{saleOffer.badge}</T>
                </GoldGradient>
              ) : null}
              <Ornament style={{ marginVertical: spacing.md }} />
              <T kind="body" style={{ color: colors.champagne, textAlign: 'center', maxWidth: 300 }}>
                {t('home.saleBody')}
              </T>
              <Button
                label={t('home.saleCta')}
                onPress={() => router.push({ pathname: '/shop', params: { sale: '1' } })}
                style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}
              />
              <Pressable onPress={() => router.push('/offers')} accessibilityRole="link" style={styles.offersLink}>
                <T kind="label" style={{ color: colors.ivory, fontSize: 10 }}>
                  {t('offers.title')} →
                </T>
              </Pressable>
            </View>
          </GoldGradient>
        </FadeIn>

        {/* Visit */}
        <FadeIn style={styles.visit}>
          <T kind="labelSmall">{config.address.full}</T>
          <T kind="h1" style={{ marginTop: 6, textAlign: 'center' }}>
            {t('home.visitTitle')}
          </T>
          <Ornament style={{ marginVertical: spacing.md }} />
          <Button label={t('home.visitCta')} variant="outline" onPress={() => router.push('/store')} compact />
        </FadeIn>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingTop: spacing.xl, paddingBottom: spacing.lg },
  hRow: { paddingHorizontal: spacing.gutter, gap: spacing.xs },
  looksBlock: { backgroundColor: colors.black, marginTop: spacing.md, paddingBottom: spacing.xl },
  playBadge: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(14,14,14,0.5)', paddingHorizontal: 8, paddingVertical: 5 },
  sale: { marginHorizontal: spacing.gutter, marginTop: spacing.xl },
  saleFrame: { padding: 1 },
  saleInner: { backgroundColor: colors.black, alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  saleTitle: { fontFamily: fonts.serif, fontSize: 46, lineHeight: 52, color: colors.ivory, marginTop: spacing.sm, letterSpacing: 1 },
  saleBadge: { paddingHorizontal: 14, paddingVertical: 6, marginTop: spacing.xs },
  saleBadgeText: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 3, color: colors.ink },
  offersLink: { minHeight: 44, justifyContent: 'center', marginTop: spacing.xs },
  visit: { alignItems: 'center', paddingHorizontal: spacing.gutter, paddingTop: spacing.xxl, paddingBottom: spacing.lg },
});
