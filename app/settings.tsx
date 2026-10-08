import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GoldLogo, Hairline } from '../components/gold';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { T } from '../components/ui/Typography';
import { Lang, useI18n } from '../i18n';
import { colors, spacing } from '../theme/theme';
import { tapLight } from '../utils/haptics';

export default function Settings() {
  const { t, lang, setLang } = useI18n();
  const options: { value: Lang; label: string }[] = [
    { value: 'en', label: t('settings.english') },
    { value: 'sq', label: t('settings.albanian') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScreenHeader title={t('settings.title')} back />
      <ScrollView contentContainerStyle={{ padding: spacing.gutter, paddingBottom: spacing.xxl }}>
        <T kind="label" style={{ marginBottom: spacing.sm }}>
          {t('settings.language')}
        </T>
        <View accessibilityRole="radiogroup">
          {options.map((o) => {
            const on = lang === o.value;
            return (
              <Pressable
                key={o.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                onPress={() => {
                  tapLight();
                  setLang(o.value);
                }}
                style={styles.row}
              >
                <T kind="h3">{o.label}</T>
                <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={20} color={on ? colors.ink : colors.muted} />
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => router.push('/offers')} style={[styles.row, { marginTop: spacing.lg }]} accessibilityRole="link">
          <T kind="h3">{t('settings.offers')}</T>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>

        <Hairline style={{ marginVertical: spacing.xl, opacity: 0.6 }} />
        <View style={{ alignItems: 'center' }}>
          <GoldLogo variant="header" />
          <T kind="bodySmall" style={{ textAlign: 'center', marginTop: spacing.md }}>
            {t('settings.aboutBody')}
          </T>
          <T kind="labelSmall" style={{ marginTop: spacing.md }}>
            {t('settings.version', { v: Constants.expoConfig?.version ?? '1.0.0' })}
          </T>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stone,
  },
});
