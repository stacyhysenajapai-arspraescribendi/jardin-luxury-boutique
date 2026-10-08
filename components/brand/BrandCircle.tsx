import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Brand } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { GoldGradient } from '../gold/GoldGradient';
import { T } from '../ui/Typography';

/** Instagram-highlight style brand circle with a thin gold ring. */
export function BrandCircle({ brand, size = 76 }: { brand: Brand; size?: number }) {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={brand.confirmed ? brand.name : `${brand.name}, ${t('common.toConfirm')}`}
      onPress={() => {
        tapLight();
        router.push(`/brands/${brand.id}`);
      }}
      style={({ pressed }) => [styles.wrap, { width: size + 16 }, pressed && { opacity: 0.7 }]}
    >
      <GoldGradient style={{ width: size, height: size, borderRadius: size / 2, padding: 1.5 }}>
        <View style={[styles.inner, { borderRadius: size / 2 }]}>
          <Image source={img(brand.image)} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={300} />
        </View>
      </GoldGradient>
      <T kind="labelSmall" numberOfLines={1} style={styles.name}>
        {brand.name}
      </T>
      {!brand.confirmed ? (
        <T kind="labelSmall" style={styles.tbc}>
          {t('common.toConfirm')}
        </T>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  inner: { flex: 1, overflow: 'hidden', borderWidth: 2, borderColor: colors.ivory, backgroundColor: colors.champagne },
  name: { marginTop: 8, color: colors.ink, fontSize: 9, letterSpacing: 1.4, textAlign: 'center' },
  tbc: { fontSize: 8, letterSpacing: 1, color: colors.muted, marginTop: 1, textTransform: 'none' },
});
