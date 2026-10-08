import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { colors } from '../../theme/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Web fallback: masked-view is native-only, so use the flat brass tone. */
export function GoldIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  return <Ionicons name={name} size={size} color={colors.brass} />;
}
