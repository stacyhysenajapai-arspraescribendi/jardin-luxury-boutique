import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GoldBorder, Hairline, Ornament } from '../../components/gold';
import { StoreMap } from '../../components/store/StoreMap';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import { IconButton } from '../../components/ui/IconButton';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { T } from '../../components/ui/Typography';
import config from '../../config';
import { useI18n } from '../../i18n';
import { colors, fonts, hitTarget, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { callStore, failAlert, openDirections, openInstagram } from '../../utils/linking';
import { openWhatsApp } from '../../utils/whatsapp';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function Action({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={20} color={colors.ink} />
      </View>
      <T kind="labelSmall" style={{ color: colors.ink, fontSize: 9, textAlign: 'center' }}>
        {label}
      </T>
    </Pressable>
  );
}

export default function Store() {
  const { t } = useI18n();
  const fail = (app: string) => () => failAlert(t('common.couldNotOpen', { app, phone: config.phoneDisplay }));
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader
        title={t('store.title')}
        right={<IconButton name="globe-outline" label={t('common.settings')} onPress={() => router.push('/settings')} />}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <StoreMap height={240} />

        <FadeIn style={styles.block}>
          <T kind="labelSmall">{t('store.address')}</T>
          <T kind="h1" style={{ marginTop: 6 }}>
            JARDIN Luxury Boutique
          </T>
          <T kind="body" style={{ marginTop: 4, color: colors.inkSoft }} selectable>
            {config.address.full}
          </T>

          <View style={styles.actions}>
            <Action icon="navigate-outline" label={t('store.directions')} onPress={() => openDirections(fail('Maps'))} />
            <Action icon="call-outline" label={t('store.call')} onPress={() => callStore(fail('Phone'))} />
            <Action icon="logo-whatsapp" label={t('store.whatsapp')} onPress={() => openWhatsApp(undefined, fail('WhatsApp'))} />
            <Action icon="logo-instagram" label={t('store.instagram')} onPress={() => openInstagram(fail('Instagram'))} />
          </View>
        </FadeIn>

        <Hairline inset={spacing.gutter} style={{ opacity: 0.6 }} />

        <FadeIn delay={120} style={styles.block}>
          <T kind="label">{t('store.hours')}</T>
          <View style={{ marginTop: spacing.sm }}>
            {config.hours.map((h, i) => (
              <View key={h.day} style={styles.hourRow} accessible>
                <T kind="body" style={[i === todayIdx && { fontFamily: fonts.sansMedium }]}>
                  {t(`store.days.${h.day}`)}
                </T>
                <T kind="body" style={{ color: h.open ? colors.ink : colors.muted }}>
                  {h.open && h.close ? `${h.open} – ${h.close}` : t('store.hoursTbc')}
                </T>
              </View>
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={200} style={styles.block}>
          <T kind="label">{t('store.contact')}</T>
          <Pressable onPress={() => callStore(fail('Phone'))} accessibilityRole="link" style={styles.contactRow}>
            <Ionicons name="call-outline" size={18} color={colors.ink} />
            <T kind="body">{config.phoneDisplay}</T>
          </Pressable>
          <Pressable onPress={() => openInstagram(fail('Instagram'))} accessibilityRole="link" style={styles.contactRow}>
            <Ionicons name="logo-instagram" size={18} color={colors.ink} />
            <T kind="body">@{config.instagram.handle}</T>
          </Pressable>
        </FadeIn>

        <FadeIn delay={260} style={{ paddingHorizontal: spacing.gutter }}>
          <GoldBorder innerStyle={styles.shopper} background={colors.champagne}>
            <T kind="labelSmall" style={{ textAlign: 'center' }}>
              JARDIN · {config.address.district}
            </T>
            <T kind="h2" style={{ textAlign: 'center', marginTop: 6 }}>
              {t('store.personalShopper')}
            </T>
            <Ornament style={{ marginVertical: spacing.md }} />
            <T kind="bodySmall" style={{ textAlign: 'center', color: colors.inkSoft }}>
              {t('store.personalShopperBody')}
            </T>
            <Button
              label={t('shopper.title')}
              onPress={() => router.push('/personal-shopper')}
              style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}
            />
          </GoldBorder>
        </FadeIn>

        <Pressable onPress={() => router.push('/offers')} accessibilityRole="link" style={styles.offersLink}>
          <T kind="label">{t('offers.title')}</T>
          <Ionicons name="arrow-forward" size={16} color={colors.ink} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { paddingHorizontal: spacing.gutter, paddingVertical: spacing.lg },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  action: { alignItems: 'center', width: 76, gap: 8 },
  actionIcon: {
    width: hitTarget + 4,
    height: hitTarget + 4,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stone,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  shopper: { padding: spacing.lg, alignItems: 'center' },
  offersLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 56,
    marginTop: spacing.lg,
  },
});
