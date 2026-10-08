import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { type as t } from '../../theme/theme';

type Kind = keyof typeof t;

interface Props extends TextProps {
  kind?: Kind;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

/** Text with a theme typography preset. */
export function T({ kind = 'body', style, children, ...rest }: Props) {
  return (
    <Text style={[t[kind] as TextStyle, style]} maxFontSizeMultiplier={1.6} {...rest}>
      {children}
    </Text>
  );
}
