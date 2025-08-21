// Design token palette (derived from design variables)
const palette = {
  primary: "#000000",
  secondary: "#9e9e9e",
  muted: "#d9d9d9",
  background: "#f4f4f4",
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
    tabIconDefault: palette.muted,
    tabIconSelected: palette.primary,
    // extended tokens
    primary: palette.primary,
    secondary: palette.secondary,
    muted: palette.muted,
    border: palette.border,
    accent: palette.accent,
    danger: palette.danger,
    success: palette.success,
    warning: palette.warning,
  },
  dark: {
    // simple dark scheme; adjust if you implement true dark theme tokens
    text: "#fff",
    background: "#000",
    tabIconDefault: "#666666",
    tabIconSelected: palette.primary,
    // extended tokens
    primary: "#ffffff",
    secondary: palette.secondary,
    muted: "#666666",
    border: "#333333",
    accent: palette.accent,
    danger: palette.danger,
    success: palette.success,
    warning: palette.warning,
  },
} as const;

export type ColorTheme = typeof Colors.light;
export type ColorScheme = keyof typeof Colors;

export { palette };
export default Colors;
