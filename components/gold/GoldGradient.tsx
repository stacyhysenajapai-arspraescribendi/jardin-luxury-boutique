import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { gold } from '../../theme/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** horizontal = left→right (hairlines); diagonal = default metallic angle */
  direction?: 'diagonal' | 'horizontal' | 'vertical';
}

const dirs = {
  diagonal: { start: gold.start, end: gold.end },
  horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
  vertical: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
};

/** The single source of the metallic gold surface. */
export function GoldGradient({ style, children, direction = 'diagonal' }: Props) {
  return (
    <LinearGradient
      colors={gold.stops as unknown as [string, string, ...string[]]}
      locations={gold.locations as unknown as [number, number, ...number[]]}
      {...dirs[direction]}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
