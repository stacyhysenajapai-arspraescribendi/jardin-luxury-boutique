import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ornament } from '../components/gold';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { T } from '../components/ui/Typography';
import config from '../config';
import { useI18n } from '../i18n';
import { colors, fonts, spacing } from '../theme/theme';
import { failAlert } from '../utils/linking';
import { openWhatsApp } from '../utils/whatsapp';

type Field = 'name' | 'phone' | 'interests' | 'sizes' | 'visit';

function Input({
  label,
  hint,
  error,
  ...rest
}: TextInputProps & { label: string; hint?: string; error?: string }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <T kind="label" nativeID={`${label}-label`}>
        {label}
      </T>
      <TextInput
        accessibilityLabel={label}
        placeholder={hint}
        placeholderTextColor={colors.muted}
        style={[styles.input, !!error && { borderColor: colors.sale }]}
        {...rest}
      />
      {error ? (
        <T kind="bodySmall" style={{ color: colors.sale, marginTop: 4 }} accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
    </View>
  );
}

/** Personal shopper request → prefilled WhatsApp message to the boutique. */
export default function PersonalShopper() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Record<Field, string>>({ name: '', phone: '', interests: '', sizes: '', visit: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const set = (k: Field) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = t('shopper.required');
    const digits = form.phone.replace(/[^\d]/g, '');
    if (!form.phone.trim()) e.phone = t('shopper.required');
    else if (digits.length < 8 || digits.length > 15) e.phone = t('shopper.invalidPhone');
    setErrors(e);
    if (Object.keys(e).length) return;

    const msg = t('shopper.wa', {
      name: form.name.trim(),
      phone: form.phone.trim(),
      interests: form.interests.trim() || '-',
      sizes: form.sizes.trim() || '-',
      visit: form.visit.trim() || '-',
    });
    openWhatsApp(msg, () => failAlert(t('common.couldNotOpen', { app: 'WhatsApp', phone: config.phoneDisplay })));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.ivory }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.top, { paddingTop: Platform.OS === 'ios' ? spacing.sm : insets.top + spacing.xs }]}>
        <View style={{ width: 44 }} />
        <T kind="h3">{t('shopper.title')}</T>
        <IconButton name="close" label={t('common.close')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/store'))} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.gutter, paddingBottom: insets.bottom + spacing.xxl }} keyboardShouldPersistTaps="handled">
        <T kind="display" style={{ textAlign: 'center', marginTop: spacing.md }}>
          {t('shopper.title')}
        </T>
        <Ornament style={{ marginVertical: spacing.md }} />
        <T kind="body" style={{ textAlign: 'center', color: colors.inkSoft, marginBottom: spacing.xl }}>
          {t('shopper.intro')}
        </T>

        <Input label={`${t('shopper.name')} *`} value={form.name} onChangeText={set('name')} error={errors.name} autoComplete="name" textContentType="name" returnKeyType="next" />
        <Input
          label={`${t('shopper.phone')} *`}
          value={form.phone}
          onChangeText={set('phone')}
          error={errors.phone}
          hint="+355 6X XXX XXXX"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
        <Input label={t('shopper.interests')} hint={t('shopper.interestsHint')} value={form.interests} onChangeText={set('interests')} multiline />
        <Input label={t('shopper.sizes')} hint={t('shopper.sizesHint')} value={form.sizes} onChangeText={set('sizes')} />
        <Input label={t('shopper.visit')} hint={t('shopper.visitHint')} value={form.visit} onChangeText={set('visit')} />

        <Button label={t('shopper.send')} icon="logo-whatsapp" onPress={submit} />
        <T kind="bodySmall" style={{ textAlign: 'center', marginTop: spacing.md }}>
          {t('shopper.privacy')}
        </T>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stone,
  },
  input: {
    marginTop: 8,
    minHeight: 48,
    borderBottomWidth: 1,
    borderColor: colors.stone,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 10,
  },
});
