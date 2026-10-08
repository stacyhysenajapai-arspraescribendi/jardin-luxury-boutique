import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors, motion } from '../theme/theme';
import { GoldLogo } from './gold';

/**
 * Black splash: the gold logo fades in, shines once, then the whole layer
 * fades away to reveal Home (which is already mounted underneath).
 */
export function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const logo = useSharedValue(0);
  const layer = useSharedValue(1);

  useEffect(() => {
    logo.value = withTiming(1, { duration: motion.slow, easing: Easing.out(Easing.cubic) });
  }, [logo]);

  const finish = useCallback(() => {
    layer.value = withDelay(
      motion.splashHold,
      withTiming(0, { duration: 700, easing: Easing.inOut(Easing.cubic) }, (f) => {
        if (f) scheduleOnRN(onDone);
      }),
    );
  }, [layer, onDone]);

  const layerStyle = useAnimatedStyle(() => ({ opacity: layer.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logo.value,
    transform: [{ scale: 0.96 + logo.value * 0.04 }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.bg, layerStyle]} pointerEvents="none">
      <Animated.View style={logoStyle}>
        <GoldLogo variant="splash" shine="once" delay={motion.slow - 100} onShineEnd={finish} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bg: { backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', zIndex: 100 },
});
