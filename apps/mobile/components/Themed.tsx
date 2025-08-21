/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  Platform,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  fontFamilyBase: "System",
  fontFamilyMono: "SpaceMono",
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 20,
  fontSizeXl: 24,
  lineHeightTight: 1.1,
  lineHeightNormal: 1.3,
  lineHeightRelaxed: 1.5,
} as const;

// iOS-style dynamic type sizes (approximate on Android)
export const textVariants = {
  largeTitle: {
    fontSize: Platform.select({ ios: 34, default: 32 }),
    fontWeight: "700" as const,
    lineHeight: Platform.select({ ios: 41, default: 38 }),
  },
  title1: {
    fontSize: Platform.select({ ios: 28, default: 26 }),
    fontWeight: "700" as const,
    lineHeight: Platform.select({ ios: 34, default: 32 }),
  },
  title2: {
    fontSize: Platform.select({ ios: 22, default: 22 }),
    fontWeight: "600" as const,
    lineHeight: Platform.select({ ios: 28, default: 26 }),
  },
  title3: {
    fontSize: Platform.select({ ios: 20, default: 20 }),
    fontWeight: "600" as const,
    lineHeight: Platform.select({ ios: 25, default: 24 }),
  },
  headline: {
    fontSize: Platform.select({ ios: 17, default: 17 }),
    fontWeight: "600" as const,
    lineHeight: Platform.select({ ios: 22, default: 22 }),
  },
  body: {
    fontSize: Platform.select({ ios: 17, default: 16 }),
    fontWeight: "400" as const,
    lineHeight: Platform.select({ ios: 22, default: 22 }),
  },
  callout: {
    fontSize: Platform.select({ ios: 16, default: 16 }),
    fontWeight: "400" as const,
    lineHeight: Platform.select({ ios: 21, default: 20 }),
  },
  subheadline: {
    fontSize: Platform.select({ ios: 15, default: 15 }),
    fontWeight: "400" as const,
    lineHeight: Platform.select({ ios: 20, default: 19 }),
  },
  footnote: {
    fontSize: Platform.select({ ios: 13, default: 13 }),
    fontWeight: "400" as const,
    lineHeight: Platform.select({ ios: 18, default: 17 }),
  },
  caption1: {
    fontSize: Platform.select({ ios: 12, default: 12 }),
    fontWeight: "400" as const,
    lineHeight: Platform.select({ ios: 16, default: 16 }),
  },
  caption2: {
    fontSize: Platform.select({ ios: 11, default: 11 }),
    fontWeight: "400" as const,
    lineHeight: Platform.select({ ios: 13, default: 14 }),
  },
} as const;
