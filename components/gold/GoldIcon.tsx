import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import { View } from 'react-native';
import { GoldGradient } from './GoldGradient';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** An Ionicon filled with the metallic gold gradient (used for active tabs). */
export function GoldIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={name} size={size} color="black" />
        </View>
      }
    >
      <GoldGradient style={{ flex: 1 }} />
    </MaskedView>
  );
}
