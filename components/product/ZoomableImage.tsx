import { Image, ImageSource } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors } from '../../theme/theme';

const MAX = 4;

/**
 * Pinch-to-zoom image (with pan while zoomed, double-tap to zoom in/out).
 * Springs back to 1× softly when released below 1.
 */
export function ZoomableImage({
  source,
  width,
  height,
  onZoomChange,
  accessibilityLabel,
}: {
  source: ImageSource | number | undefined;
  width: number;
  height: number;
  onZoomChange?: (zoomed: boolean) => void;
  accessibilityLabel?: string;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);
  const zoomed = useSharedValue(false);

  const report = (z: boolean) => onZoomChange?.(z);

  const clamp = (v: number, s: number, size: number) => {
    'worklet';
    const max = ((s - 1) * size) / 2;
    return Math.min(max, Math.max(-max, v));
  };

  const setZoomed = (z: boolean) => {
    'worklet';
    if (zoomed.value !== z) {
      zoomed.value = z;
      if (onZoomChange) scheduleOnRN(report, z);
    }
  };

  const reset = () => {
    'worklet';
    scale.value = withTiming(1, { duration: 320 });
    savedScale.value = 1;
    tx.value = withTiming(0, { duration: 320 });
    ty.value = withTiming(0, { duration: 320 });
    savedTx.value = 0;
    savedTy.value = 0;
    setZoomed(false);
  };

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(MAX, Math.max(0.8, savedScale.value * e.scale));
      if (scale.value > 1.02) setZoomed(true);
    })
    .onEnd(() => {
      if (scale.value <= 1.02) {
        reset();
      } else {
        savedScale.value = scale.value;
        tx.value = withTiming(clamp(tx.value, scale.value, width));
        ty.value = withTiming(clamp(ty.value, scale.value, height));
        savedTx.value = clamp(tx.value, scale.value, width);
        savedTy.value = clamp(ty.value, scale.value, height);
      }
    });

  // Pan only while zoomed, so horizontal swipes still page the gallery at 1×.
  const pan = Gesture.Pan()
    .averageTouches(true)
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (savedScale.value > 1.02) state.activate();
      else state.fail();
    })
    .onUpdate((e) => {
      tx.value = clamp(savedTx.value + e.translationX, scale.value, width);
      ty.value = clamp(savedTy.value + e.translationY, scale.value, height);
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (savedScale.value > 1.02) {
        reset();
      } else {
        scale.value = withTiming(2.2, { duration: 360 });
        savedScale.value = 2.2;
        setZoomed(true);
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={composed}>
      <View style={{ width, height, overflow: 'hidden', backgroundColor: colors.champagne }}>
        <Animated.View style={[StyleSheet.absoluteFill, style]}>
          <Image
            source={source}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={400}
            accessibilityLabel={accessibilityLabel}
            accessibilityIgnoresInvertColors
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
