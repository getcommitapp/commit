// Design token palette (derived from design variables) - A1FFEB
const palette = {
  primary: "#000000",
  secondary: "#ffffff",
  mutedForeground: "#9e9e9e",
  muted: "#d9d9d9",
  background: "#f4f4f4",
  colorfulBackground: "#A1FFEB",
  card: "#ffffff",
  border: "#e8e8e8",
  accent: "#a1ffeb",
  danger: "#d83600",
  success: "#58ba2b",
  warning: "#b8af00",
};

const Colors = {
  light: {
    // core
    text: palette.primary,
    background: palette.background,
    tabIconDefault: palette.mutedForeground,
    tabIconSelected: palette.primary,
    // extended tokens
    primary: palette.primary,
    secondary: palette.secondary,
    colorfulBackground: palette.colorfulBackground,
    mutedForeground: palette.mutedForeground,
    muted: palette.muted,
    card: palette.card,
    border: palette.border,
    accent: palette.accent,
    danger: palette.danger,
    success: palette.success,
    warning: palette.warning,
    link: palette.primary,
  },
  // TODO: Implement dark theme tokens
  dark: {
    text: "#fff",
    background: "#000",
    tabIconDefault: "#666666",
    tabIconSelected: palette.primary,
    // extended tokens
    primary: "#ffffff",
    secondary: "#000000",
    colorfulBackground: palette.colorfulBackground,
    mutedForeground: palette.mutedForeground,
    muted: "#666666",
    card: "#000000",
    border: "#333333",
    accent: palette.accent,
    danger: palette.danger,
    success: palette.success,
    warning: palette.warning,
    link: "#ffffff",
  },
} as const;

export type ColorTheme = typeof Colors.light;
export type ColorScheme = keyof typeof Colors;

export { palette };
export default Colors;
