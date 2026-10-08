import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, fonts, hitTarget } from '../../theme/theme';
import { tapMedium } from '../../utils/haptics';
import { GoldGradient } from '../gold/GoldGradient';

type Variant = 'gold' | 'ink' | 'outline' | 'ghost' | 'ivory';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  haptic?: boolean;
  accessibilityHint?: string;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Primary = gold gradient fill with ink label. Secondary = ink fill. Outline = hairline ink. */
export function Button({
  label,
  onPress,
  variant = 'gold',
  icon,
  style,
  disabled,
  loading,
  haptic = true,
  accessibilityHint,
  compact,
}: Props) {
  const pressed = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.12,
    transform: [{ scale: 1 - pressed.value * 0.015 }],
  }));

  const fg = variant === 'ink' ? colors.ivory : colors.ink;
  const content = (
    <View style={[styles.inner, compact && styles.compact]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={17} color={fg} style={{ marginRight: compact ? 8 : 10 }} />}
          <Text style={[styles.label, compact && styles.labelCompact, { color: fg }]} numberOfLines={1}>
            {label.toUpperCase()}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      onPressIn={() => (pressed.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: 220 }))}
      onPress={() => {
        if (haptic) tapMedium();
        onPress?.();
      }}
      style={[styles.base, variantStyles[variant], disabled && { opacity: 0.45 }, anim, style]}
    >
      {variant === 'gold' ? <GoldGradient style={StyleSheet.absoluteFill} /> : null}
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: hitTarget + 4, overflow: 'hidden', justifyContent: 'center' },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 14 },
  compact: { paddingHorizontal: 10, paddingVertical: 10 },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 2.4 },
  labelCompact: { fontSize: 11.5, letterSpacing: 1.4 },
});

const variantStyles: Record<Variant, ViewStyle> = {
  gold: {},
  ink: { backgroundColor: colors.ink },
  outline: { borderWidth: 1, borderColor: colors.ink, backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent' },
  ivory: { backgroundColor: colors.ivory },
};
