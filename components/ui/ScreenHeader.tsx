import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { GoldLogo, Hairline } from '../gold';
import { IconButton } from './IconButton';
import { T } from './Typography';

/**
 * Top bar. With `logo` it shows the shining gold logo (Home); otherwise a serif title.
 * `back` adds a back button; `right` is an optional trailing element.
 */
export function ScreenHeader({
  title,
  logo,
  back,
  right,
  dark,
  hairline = true,
}: {
  title?: string;
  logo?: boolean;
  back?: boolean;
  right?: React.ReactNode;
  dark?: boolean;
  hairline?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const fg = dark ? colors.ivory : colors.ink;
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: dark ? colors.black : colors.ivory }}>
      <View style={styles.row}>
        <View style={styles.side}>
          {back ? (
            <IconButton
              name="chevron-back"
              label={t('common.back')}
              color={fg}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          ) : null}
        </View>
        <View style={styles.center}>
          {logo ? (
            <GoldLogo variant="header" />
          ) : (
            <T kind="h3" numberOfLines={1} style={{ color: fg, letterSpacing: 0.5 }} accessibilityRole="header">
              {title}
            </T>
          )}
        </View>
        <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
      </View>
      {hairline ? <Hairline style={{ opacity: 0.5 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingHorizontal: spacing.xs },
  side: { width: 64, flexDirection: 'row', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xs },
});
