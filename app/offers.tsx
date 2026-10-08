import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Badge, GoldGradient, Ornament } from '../components/gold';
import { EmptyState } from '../components/ui/EmptyState';
import { FadeIn } from '../components/ui/FadeIn';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { T } from '../components/ui/Typography';
import { repo } from '../data/repository';
import type { Offer } from '../data/types';
import { useI18n } from '../i18n';
import { colors, fonts, spacing } from '../theme/theme';
import { formatDate } from '../utils/format';
import { tapLight } from '../utils/haptics';
import { img } from '../utils/images';
import { openOffer } from '../utils/navigation';
import { useAsync } from '../utils/useAsync';

/** Sale poster in the boutique's two colourways: black + gold or cream + gold. */
function OfferPoster({ offer, upcoming }: { offer: Offer; upcoming?: boolean }) {
  const { t, locale } = useI18n();
  const dark = offer.style === 'black';
  const fg = dark ? colors.ivory : colors.ink;
  return (
    <Pressable
      disabled={upcoming}
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${offer.subtitle}`}
      onPress={() => {
        tapLight();
        openOffer(offer);
      }}
      style={({ pressed }) => [pressed && { opacity: 0.9 }]}
    >
      <GoldGradient style={{ padding: 1 }}>
        <View style={[styles.poster, { backgroundColor: dark ? colors.black : colors.champagne }]}>
          {offer.image ? (
            <Image source={img(offer.image)} style={[StyleSheet.absoluteFill, { opacity: dark ? 0.35 : 0.3 }]} contentFit="cover" />
          ) : null}
          <T kind="labelSmall" style={{ color: dark ? colors.stone : colors.muted }}>
            JARDIN · LUXURY BOUTIQUE
          </T>
          <T style={[styles.title, { color: fg }]}>{offer.title}</T>
          {offer.badge ? <Badge label={offer.badge} style={{ alignSelf: 'center' }} /> : null}
          <Ornament style={{ marginVertical: spacing.md }} />
          <T kind="body" style={{ color: dark ? colors.champagne : colors.inkSoft, textAlign: 'center' }}>
            {offer.subtitle}
          </T>
          <T kind="labelSmall" style={{ marginTop: spacing.md, color: dark ? colors.stone : colors.muted, textAlign: 'center' }}>
            {upcoming
              ? t('offers.validRange', { from: formatDate(offer.validFrom, locale), to: formatDate(offer.validTo, locale) })
              : t('offers.validUntil', { date: formatDate(offer.validTo, locale) })}
          </T>
          {!upcoming ? (
            <View style={[styles.cta, { borderColor: fg }]}>
              <T kind="label" style={{ color: fg }}>
                {t('offers.shop')}
              </T>
            </View>
          ) : null}
        </View>
      </GoldGradient>
    </Pressable>
  );
}

export default function Offers() {
  const { t } = useI18n();
  const { data, loading } = useAsync(
    async () => ({ active: await repo.getActiveOffers(), upcoming: await repo.getUpcomingOffers() }),
    [],
    { active: [] as Offer[], upcoming: [] as Offer[] },
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader title={t('offers.title')} back />
      <ScrollView contentContainerStyle={{ padding: spacing.gutter, gap: spacing.lg, paddingBottom: spacing.xxl }}>
        <T kind="labelSmall">{t('offers.subtitle')}</T>
        {!loading && data.active.length === 0 ? <EmptyState icon="pricetag-outline" title={t('offers.title')} body={t('offers.none')} /> : null}
        {data.active.map((o, i) => (
          <FadeIn key={o.id} delay={i * 120}>
            <OfferPoster offer={o} />
          </FadeIn>
        ))}
        {data.upcoming.length > 0 ? (
          <>
            <T kind="h2" style={{ marginTop: spacing.md }}>
              {t('offers.upcoming')}
            </T>
            {data.upcoming.map((o) => (
              <View key={o.id} style={{ opacity: 0.85 }}>
                <OfferPoster offer={o} upcoming />
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, overflow: 'hidden' },
  title: { fontFamily: fonts.serif, fontSize: 40, lineHeight: 46, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.sm },
  cta: { marginTop: spacing.lg, borderBottomWidth: 1, paddingBottom: 3, minHeight: 28, justifyContent: 'flex-end' },
});
