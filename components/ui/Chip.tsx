import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';

/** Selectable chip used for sizes and filters. Selected = ink fill. */
export function Chip({
  label,
  selected,
  onPress,
  disabled,
  style,
  accessibilityLabel,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={() => {
        tapLight();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        disabled && { opacity: 0.35 },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Text style={[styles.text, selected && { color: colors.ivory }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    minWidth: 48,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.stone,
    backgroundColor: colors.ivory,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: { backgroundColor: colors.ink, borderColor: colors.ink },
  text: { fontFamily: fonts.sans, fontSize: 13, letterSpacing: 0.6, color: colors.ink },
});
