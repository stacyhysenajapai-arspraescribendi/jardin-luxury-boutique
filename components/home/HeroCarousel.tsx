import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { Offer } from '../../data/types';
import { useI18n } from '../../i18n';
import { colors, fonts, spacing } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';
import { img } from '../../utils/images';
import { Badge } from '../gold';
import { GoldGradient } from '../gold/GoldGradient';
import { T } from '../ui/Typography';

const AUTOPLAY_MS = 6500;

function Slide({
  offer,
  index,
  width,
  height,
  scrollX,
  scrollY,
  onPress,
}: {
  offer: Offer;
  index: number;
  width: number;
  height: number;
  scrollX: SharedValue<number>;
  scrollY?: SharedValue<number>;
  onPress: () => void;
}) {
  const { t } = useI18n();
  const dark = offer.style === 'black';

  const imageStyle = useAnimatedStyle(() => {
    const x = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [-width * 0.22, 0, width * 0.22],
      Extrapolation.CLAMP,
    );
    const y = scrollY ? scrollY.value : 0;
    return {
      transform: [
        { translateX: x },
        { translateY: y > 0 ? y * 0.4 : y * 0.5 },
        { scale: y < 0 ? 1 + -y / height : 1.06 },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const d = Math.abs(scrollX.value - index * width) / width;
    return {
      opacity: interpolate(d, [0, 0.6], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateY: interpolate(d, [0, 1], [0, 18], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${offer.subtitle}`}
      style={{ width, height, overflow: 'hidden', backgroundColor: dark ? colors.black : colors.champagne }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image source={img(offer.image)} style={StyleSheet.absoluteFill} contentFit="cover" transition={500} />
      </Animated.View>
      <LinearGradient
        colors={
          dark
            ? ['rgba(14,14,14,0)', 'rgba(14,14,14,0.35)', 'rgba(14,14,14,0.88)']
            : ['rgba(250,247,240,0)', 'rgba(250,247,240,0.55)', 'rgba(250,247,240,0.96)']
        }
        locations={[0.35, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.copy, textStyle]}>
        {offer.badge ? <Badge label={offer.badge} style={{ marginBottom: 14 }} /> : null}
        <T kind="display" style={[styles.title, dark && { color: colors.ivory }]}>
          {offer.title}
        </T>
        <T kind="body" style={[styles.sub, dark && { color: colors.champagne }]} numberOfLines={2}>
          {offer.subtitle}
        </T>
        <View style={[styles.cta, { borderColor: dark ? colors.ivory : colors.ink }]}>
          <T kind="label" style={dark && { color: colors.ivory }}>
            {t('home.discover')}
          </T>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function HeroCarousel({
  offers,
  onPressOffer,
  scrollY,
}: {
  offers: Offer[];
  onPressOffer: (o: Offer) => void;
  scrollY?: SharedValue<number>;
}) {
  const { width } = useWindowDimensions();
  const height = Math.min(Math.round(width * 1.22), 620);
  const scrollX = useSharedValue(0);
  const ref = useRef<Animated.ScrollView>(null);
  const [index, setIndex] = useState(0);
  const dragging = useRef(false);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (offers.length < 2) return;
    const id = setInterval(() => {
      if (dragging.current) return;
      const next = (index + 1) % offers.length;
      ref.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, offers.length, width]);

  return (
    <View>
      <Animated.ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        onScrollBeginDrag={() => (dragging.current = true)}
        onMomentumScrollEnd={(e) => {
          dragging.current = false;
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        onScrollEndDrag={(e) => {
          // web has no momentum events
          dragging.current = false;
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) setIndex(i);
        }}
      >
        {offers.map((o, i) => (
          <Slide
            key={o.id}
            offer={o}
            index={i}
            width={width}
            height={height}
            scrollX={scrollX}
            scrollY={scrollY}
            onPress={() => {
              tapLight();
              onPressOffer(o);
            }}
          />
        ))}
      </Animated.ScrollView>
      {offers.length > 1 && (
        <View style={styles.dots} accessibilityRole="adjustable" accessibilityLabel={`${index + 1} / ${offers.length}`}>
          {offers.map((o, i) =>
            i === index ? (
              <GoldGradient key={o.id} direction="horizontal" style={[styles.dot, styles.dotActive]} />
            ) : (
              <View key={o.id} style={[styles.dot, { backgroundColor: offers[index]?.style === 'black' ? 'rgba(250,247,240,0.5)' : 'rgba(14,14,14,0.25)' }]} />
            ),
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { position: 'absolute', left: spacing.gutter, right: spacing.gutter, bottom: 54 },
  title: { fontFamily: fonts.serif, fontSize: 44, lineHeight: 48 },
  sub: { marginTop: 6, color: colors.inkSoft, maxWidth: 320 },
  cta: { marginTop: 18, borderBottomWidth: 1, alignSelf: 'flex-start', paddingBottom: 3 },
  dots: { position: 'absolute', bottom: 24, left: spacing.gutter, flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 14, height: 2 },
  dotActive: { width: 30 },
});
