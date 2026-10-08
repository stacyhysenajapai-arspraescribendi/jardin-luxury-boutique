import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import config from '../../config';
import { useI18n } from '../../i18n';
import { colors, spacing } from '../../theme/theme';
import { GoldGradient } from '../gold/GoldGradient';
import { T } from '../ui/Typography';

/** react-native-maps is native-only; the web preview shows a stylised map card. */
export function StoreMap({ height = 240 }: { height?: number }) {
  const { t } = useI18n();
  return (
    <View style={[styles.card, { height }]} accessibilityLabel={`${t('store.mapNote')}: ${config.address.full}`}>
      {[0.2, 0.45, 0.7].map((p) => (
        <View key={`h${p}`} style={[styles.road, { top: `${p * 100}%`, left: 0, right: 0, height: 6 }]} />
      ))}
      {[0.3, 0.62].map((p) => (
        <View key={`v${p}`} style={[styles.road, { left: `${p * 100}%`, top: 0, bottom: 0, width: 6 }]} />
      ))}
      <View style={styles.pinWrap}>
        <GoldGradient style={styles.pin}>
          <Ionicons name="location" size={22} color={colors.ink} />
        </GoldGradient>
        <T kind="labelSmall" style={{ color: colors.ink, marginTop: spacing.xs }}>
          {config.address.street} · {config.address.district}
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.champagne, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  road: { position: 'absolute', backgroundColor: colors.ivory, opacity: 0.9 },
  pinWrap: { alignItems: 'center' },
  pin: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
