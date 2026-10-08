import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import { T } from './Typography';

export function SectionHeader({
  title,
  eyebrow,
  actionLabel,
  onAction,
  dark,
}: {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  onAction?: () => void;
  dark?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <T kind="labelSmall" style={[{ marginBottom: 4 }, dark && { color: colors.stone }]}>
            {eyebrow}
          </T>
        ) : null}
        <T kind="h2" style={dark && { color: colors.ivory }} accessibilityRole="header">
          {title}
        </T>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="link"
          accessibilityLabel={`${actionLabel}: ${title}`}
          hitSlop={10}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <T kind="label" style={[styles.actionText, dark && { color: colors.ivory, borderColor: colors.ivory }]}>
            {actionLabel}
          </T>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.gutter,
    marginBottom: spacing.md,
  },
  action: { minHeight: 44, justifyContent: 'flex-end', paddingLeft: 12 },
  actionText: { borderBottomWidth: 1, borderColor: colors.ink, paddingBottom: 2, fontSize: 10 },
});
