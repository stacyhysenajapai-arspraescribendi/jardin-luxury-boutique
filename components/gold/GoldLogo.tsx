/**
 * Gold JARDIN logo with a masked shine sweep (iOS / Android).
 *
 * Layers (inside MaskedView, so they only show through the letter shapes):
 *   1. static multi-stop metallic gold gradient
 *   2. a narrow, rotated white-gold band animated with Reanimated (the "shine")
 * Outside the mask: an optional tiny sparkle that blooms at the end of each sweep.
 *
 * If `config.logoImage` is set, that image is used as the mask instead of text.
 */
import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import config from '../../config';
import { gold, motion } from '../../theme/theme';
import { GoldGradient } from './GoldGradient';
import { GoldLogoProps, LOGO_SIZES, logoStyles } from './GoldLogo.shared';

function LogoShape({ variant, hidden }: { variant: 'splash' | 'header'; hidden?: boolean }) {
  const s = logoStyles(variant);
  if (config.logoImage) {
    const h = variant === 'splash' ? 84 : 40;
    return (
      <Image
        source={config.logoImage as never}
        style={{ height: h, width: h * config.logoAspectRatio, opacity: hidden ? 0 : 1 }}
        contentFit="contain"
      />
    );
  }
  return (
    <View style={[s.wrap, hidden && { opacity: 0 }]}>
      <Text style={s.title} allowFontScaling={false}>
        JARDIN
      </Text>
      <Text style={s.sub} allowFontScaling={false}>
        LUXURY BOUTIQUE
      </Text>
    </View>
  );
}

function Sparkle({ size }: { size: number }) {
  const arm = { position: 'absolute' as const, backgroundColor: '#FFF8DE', borderRadius: 1 };
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[arm, { width: 1.4, height: size }]} />
      <View style={[arm, { width: size, height: 1.4 }]} />
      <View style={[arm, { width: size * 0.45, height: 1, transform: [{ rotate: '45deg' }], opacity: 0.7 }]} />
      <View style={[arm, { width: size * 0.45, height: 1, transform: [{ rotate: '-45deg' }], opacity: 0.7 }]} />
      <View
        style={{
          width: 3,
          height: 3,
          borderRadius: 2,
          backgroundColor: '#FFFFFF',
          shadowColor: '#FFF3C4',
          shadowOpacity: 1,
          shadowRadius: 4,
        }}
      />
    </View>
  );
}

export function GoldLogo({
  variant = 'header',
  shine,
  sparkle = true,
  delay = 400,
  onShineEnd,
  accessibilityLabel = 'JARDIN Luxury Boutique',
}: GoldLogoProps) {
  const mode = shine ?? (variant === 'splash' ? 'once' : 'loop');
  const reduceMotion = useReducedMotion();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const progress = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  useEffect(() => {
    if (!size.w) return;
    const easing = Easing.inOut(Easing.cubic);
    if (mode === 'off' || reduceMotion) {
      progress.value = 0;
      if (mode === 'once' && onShineEnd) {
        const t = setTimeout(onShineEnd, 600);
        return () => clearTimeout(t);
      }
      return;
    }
    if (mode === 'once') {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withTiming(1, { duration: motion.shineSweep, easing }, (finished) => {
          if (finished && onShineEnd) scheduleOnRN(onShineEnd);
        }),
      );
    } else {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: motion.shineSweep, easing }),
            withTiming(1, { duration: motion.shinePause }), // hold (band is off-screen)
            withTiming(0, { duration: 0 }),
          ),
          -1,
        ),
      );
    }
    return () => cancelAnimation(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, mode, reduceMotion, delay]);

  const bandW = Math.max(28, size.w * 0.28);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-bandW * 1.6, size.w + bandW * 0.6]) },
      { rotate: '18deg' },
    ],
  }));

  const sparkleStyle = useAnimatedStyle(() => {
    const o = interpolate(progress.value, [0, 0.8, 0.9, 1], [0, 0, 0.9, 0], 'clamp');
    return {
      opacity: sparkle ? o : 0,
      transform: [
        { scale: interpolate(progress.value, [0.8, 0.9, 1], [0.3, 1, 0.5], 'clamp') },
        { rotate: `${interpolate(progress.value, [0.8, 1], [0, 45], 'clamp')}deg` },
      ],
    };
  });

  const sparkleSize = variant === 'splash' ? 16 : 9;
  const titleH = LOGO_SIZES[variant].title * 1.12;

  return (
    <View accessible accessibilityRole="header" accessibilityLabel={accessibilityLabel}>
      <MaskedView maskElement={<LogoShape variant={variant} />}>
        {/* Invisible copy sizes the container to the logo exactly. */}
        <View onLayout={onLayout}>
          <LogoShape variant={variant} hidden />
        </View>
        <GoldGradient style={StyleSheet.absoluteFill} />
        {size.w > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[{ position: 'absolute', top: -size.h, height: size.h * 3, width: bandW }, bandStyle]}
          >
            <LinearGradient
              colors={gold.shine as unknown as [string, string, ...string[]]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}
      </MaskedView>
      {sparkle && size.w > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: size.w - sparkleSize * (variant === 'splash' ? 1.6 : 1.4),
              top: titleH * 0.08 - sparkleSize / 2,
            },
            sparkleStyle,
          ]}
        >
          <Sparkle size={sparkleSize} />
        </Animated.View>
      )}
    </View>
  );
}

export default GoldLogo;
