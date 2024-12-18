/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

type ThemeProps = {
  light?: string;
  dark?: string;
};

type ColorName = keyof typeof colors;

export function useThemeColor(props: ThemeProps, colorName: ColorName): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme as keyof ThemeProps];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const color = colors[colorName];
    // If color is an array (linear gradient), return the first color
    return Array.isArray(color) ? color[0] : color;
  }
}
