import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { motion } from '../../theme/theme';

/**
 * Slow, soft entrance used for sections. Uses a shared value rather than a
 * layout `entering` animation so the view always keeps its place in the flow
 * (layout animations take the node out of flow on web while they run).
 */
export function FadeIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: motion.slow, easing: Easing.out(Easing.cubic) }));
  }, [delay, p]);

  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * 14 }],
  }));

  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}
