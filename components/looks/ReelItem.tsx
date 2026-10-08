import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { Brand, Look, Product } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, fonts, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { Badge, Hairline } from '../gold';
import { IconButton } from '../ui/IconButton';
import { T } from '../ui/Typography';

interface Props {
  look: Look;
  products: Product[];
  brands: Map<string, Brand>;
  width: number;
  height: number;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
  bottomInset: number;
}

function Video({ uri, active, muted }: { uri: string; active: boolean; muted: boolean }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = muted;
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    if (active) player.play();
    else player.pause();
  }, [active, player]);

  return (
    <>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
      />
      {status === 'loading' ? <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(14,14,14,0.15)' }]} /> : null}
    </>
  );
}

/** One full-screen look: video (or poster), title, and tappable tagged products. */
export function ReelItem({ look, products, brands, width, height, active, muted, onToggleMute, bottomInset }: Props) {
  const { t } = useI18n();
  const hasVideo = !!look.videoUrl;

  return (
    <View style={{ width, height, backgroundColor: colors.black }}>
      <Image source={img(look.poster)} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
      {hasVideo ? <Video uri={look.videoUrl!} active={active} muted={muted} /> : null}

      <LinearGradient
        colors={['rgba(14,14,14,0.55)', 'rgba(14,14,14,0)', 'rgba(14,14,14,0)', 'rgba(14,14,14,0.85)']}
        locations={[0, 0.18, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {!hasVideo ? (
        <View style={styles.soon} pointerEvents="none">
          <Ionicons name="play-circle-outline" size={44} color={colors.ivory} style={{ opacity: 0.8 }} />
          <T kind="label" style={{ color: colors.ivory, marginTop: 8 }}>
            {t('looks.comingSoon')}
          </T>
        </View>
      ) : (
        <IconButton
          name={muted ? 'volume-mute-outline' : 'volume-high-outline'}
          label={muted ? t('looks.unmute') : t('looks.mute')}
          color={colors.ivory}
          onPress={onToggleMute}
          background="rgba(14,14,14,0.35)"
          style={styles.mute}
        />
      )}

      <View style={[styles.bottom, { paddingBottom: bottomInset + spacing.md }]}>
        {look.placeholder ? <Badge label={t('common.placeholder').toUpperCase()} tone="ivory" style={{ marginBottom: 10 }} /> : null}
        <T kind="h1" style={{ color: colors.ivory }}>
          {look.title}
        </T>
        {look.stylist ? (
          <T kind="bodySmall" style={{ color: colors.stone, marginTop: 2 }}>
            {t('looks.styledBy', { name: look.stylist })}
          </T>
        ) : null}
        <Hairline style={{ marginVertical: spacing.md, width: 48 }} />
        <T kind="labelSmall" style={{ color: colors.stone, marginBottom: 10 }}>
          {t('looks.shopThisLook')} · {t('looks.pieces', { count: products.length })}
        </T>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {products.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityLabel={`${brands.get(p.brandId)?.name ?? ''} ${p.name}`}
              onPress={() => {
                tapLight();
                router.push(`/product/${p.id}`);
              }}
              style={({ pressed }) => [styles.tag, pressed && { opacity: 0.8 }]}
            >
              <Image source={img(p.images[0])} style={styles.tagImg} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <T kind="labelSmall" numberOfLines={1} style={{ color: colors.ink, fontSize: 9 }}>
                  {brands.get(p.brandId)?.name}
                </T>
                <T numberOfLines={2} style={styles.tagName}>
                  {p.name}
                </T>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.muted} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  soon: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', marginBottom: 120 },
  mute: { position: 'absolute', right: spacing.sm, top: '45%' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.gutter },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 220,
    minHeight: 64,
    padding: 8,
    backgroundColor: colors.overlayLight,
  },
  tagImg: { width: 44, height: 55, backgroundColor: colors.champagne },
  tagName: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16, color: colors.ink },
});
