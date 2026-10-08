import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../../theme/theme';
import { GoldGradient } from './GoldGradient';

export { GoldGradient } from './GoldGradient';
export { GoldIcon } from './GoldIcon';
export { GoldLogo } from './GoldLogo';

/** Thin gold hairline divider (brass shelf edge). */
export function Hairline({ style, inset = 0 }: { style?: StyleProp<ViewStyle>; inset?: number }) {
  return <GoldGradient direction="horizontal" style={[{ height: 1, marginHorizontal: inset, opacity: 0.85 }, style]} />;
}

/** Short centered ornament: ── ◆ ── */
export function Ornament({ width = 72, style }: { width?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }, style]}>
      <GoldGradient direction="horizontal" style={{ width: width / 2 - 6, height: 1 }} />
      <GoldGradient style={{ width: 5, height: 5, marginHorizontal: 4, transform: [{ rotate: '45deg' }] }} />
      <GoldGradient direction="horizontal" style={{ width: width / 2 - 6, height: 1 }} />
    </View>
  );
}

/** 1px gold frame around arbitrary content. */
export function GoldBorder({
  children,
  style,
  innerStyle,
  width = 1,
  radius = radii.none,
  background = colors.ivory,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  width?: number;
  radius?: number;
  background?: string;
}) {
  return (
    <GoldGradient style={[{ padding: width, borderRadius: radius }, style]}>
      <View style={[{ backgroundColor: background, borderRadius: Math.max(0, radius - width), flexGrow: 1 }, innerStyle]}>
        {children}
      </View>
    </GoldGradient>
  );
}

/** Small gold badge: SALE / NEW / UP TO 70%. `tone="ink"` gives ink-on-ivory for NEW. */
export function Badge({ label, tone = 'gold', style }: { label: string; tone?: 'gold' | 'ink' | 'ivory'; style?: StyleProp<ViewStyle> }) {
  const text = <Text style={[styles.badgeText, tone === 'ink' && { color: colors.ivory }]}>{label}</Text>;
  if (tone === 'gold') return <GoldGradient style={[styles.badge, style]}>{text}</GoldGradient>;
  return (
    <View style={[styles.badge, { backgroundColor: tone === 'ink' ? colors.ink : colors.ivory }, style]}>{text}</View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { fontFamily: fonts.sansMedium, fontSize: 9.5, letterSpacing: 1.8, color: colors.ink },
});
