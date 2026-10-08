import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import { Ornament } from '../gold';
import { Button } from './Button';
import { T } from './Typography';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: IconName;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl }}>
      <Ionicons name={icon} size={34} color={colors.brass} />
      <T kind="h2" style={{ marginTop: spacing.md, textAlign: 'center' }}>
        {title}
      </T>
      <Ornament style={{ marginVertical: spacing.md }} />
      {body ? (
        <T kind="bodySmall" style={{ textAlign: 'center' }}>
          {body}
        </T>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="outline" onPress={onAction} style={{ marginTop: spacing.lg }} compact />
      ) : null}
    </View>
  );
}
