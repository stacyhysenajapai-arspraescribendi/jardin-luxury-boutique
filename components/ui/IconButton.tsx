import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { colors, hitTarget } from '../../theme/theme';
import { tapLight } from '../../utils/haptics';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function IconButton({
  name,
  onPress,
  label,
  color = colors.ink,
  size = 22,
  style,
  background,
}: {
  name: IconName;
  onPress: () => void;
  label: string;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  background?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={({ pressed }) => [
        {
          width: hitTarget - 4,
          height: hitTarget - 4,
          borderRadius: hitTarget,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
          opacity: pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}
