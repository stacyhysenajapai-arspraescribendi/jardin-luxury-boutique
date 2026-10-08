import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Brand, Category, ProductFilters } from '../../data/types';
import { CATEGORIES } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { Hairline } from '../gold';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { IconButton } from '../ui/IconButton';
import { T } from '../ui/Typography';

const toggle = <X,>(list: X[] | undefined, v: X): X[] => {
  const l = list ?? [];
  return l.includes(v) ? l.filter((x) => x !== v) : [...l, v];
};

export function FilterSheet({
  visible,
  onClose,
  value,
  onApply,
  brands,
  sizes,
  countFor,
}: {
  visible: boolean;
  onClose: () => void;
  value: ProductFilters;
  onApply: (f: ProductFilters) => void;
  brands: Brand[];
  sizes: string[];
  countFor: (f: ProductFilters) => number;
}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<ProductFilters>(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const count = countFor(draft);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('common.close')} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.header}>
            <T kind="h2">{t('shop.filters')}</T>
            <IconButton name="close" label={t('common.close')} onPress={onClose} />
          </View>
          <Hairline />
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.switchRow}>
              <T kind="label">{t('shop.saleOnly')}</T>
              <Switch
                value={!!draft.saleOnly}
                onValueChange={(v) => {
                  tapLight();
                  setDraft((d) => ({ ...d, saleOnly: v }));
                }}
                trackColor={{ true: colors.brass, false: colors.stone }}
                thumbColor={colors.ivory}
                accessibilityLabel={t('shop.saleOnly')}
              />
            </View>

            <T kind="label" style={styles.section}>
              {t('shop.category')}
            </T>
            <View style={styles.wrap}>
              {CATEGORIES.map((c: Category) => (
                <Chip
                  key={c}
                  label={t(`categories.${c}`)}
                  selected={draft.categories?.includes(c)}
                  onPress={() => setDraft((d) => ({ ...d, categories: toggle(d.categories, c) }))}
                />
              ))}
            </View>

            <T kind="label" style={styles.section}>
              {t('shop.brand')}
            </T>
            <View style={styles.wrap}>
              {brands.map((b) => (
                <Chip
                  key={b.id}
                  label={b.confirmed ? b.name : `${b.name} *`}
                  accessibilityLabel={b.confirmed ? b.name : `${b.name}, ${t('common.toConfirm')}`}
                  selected={draft.brandIds?.includes(b.id)}
                  onPress={() => setDraft((d) => ({ ...d, brandIds: toggle(d.brandIds, b.id) }))}
                />
              ))}
            </View>

            <T kind="label" style={styles.section}>
              {t('shop.size')}
            </T>
            <View style={styles.wrap}>
              {sizes.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={draft.sizes?.includes(s)}
                  onPress={() => setDraft((d) => ({ ...d, sizes: toggle(d.sizes, s) }))}
                />
              ))}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                tapLight();
                setDraft({ query: draft.query });
              }}
              accessibilityRole="button"
              style={styles.clear}
            >
              <T kind="label" style={{ textDecorationLine: 'underline' }}>
                {t('shop.clearAll')}
              </T>
            </Pressable>
            <Button
              label={t('shop.showResults', { count })}
              variant="ink"
              style={{ flex: 1 }}
              compact
              onPress={() => {
                onApply(draft);
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.ivory, maxHeight: '88%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.gutter,
    paddingRight: spacing.xs,
    paddingVertical: spacing.sm,
  },
  content: { padding: spacing.gutter, paddingBottom: spacing.lg },
  section: { marginTop: spacing.lg, marginBottom: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  clear: { minHeight: 48, justifyContent: 'center', paddingRight: spacing.xs },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.gutter, paddingTop: spacing.sm },
});
