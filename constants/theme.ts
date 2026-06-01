// SewerSafe Dock — Design System
export const Colors = {
  // Safety Status Colors
  safe: '#22C55E',
  safeBg: '#F0FDF4',
  safeBorder: '#BBF7D0',
  warning: '#EAB308',
  warningBg: '#FEFCE8',
  warningBorder: '#FEF08A',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',

  // Primary Brand
  primary: '#0D11F9',
  primaryLight: '#4B4DFA',
  accent: '#6C5CE7',
  accentLight: '#A399F0',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceAlt: '#E2E8F0',
  border: '#CBD5E1',
  borderLight: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Dark mode variants
  darkBg: '#0F172A',
  darkSurface: '#1E293B',
  darkBorder: '#334155',
  darkText: '#F8FAFC',
  darkTextSecondary: '#94A3B8',

  // Misc
  overlay: 'rgba(15, 23, 42, 0.6)',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};

export type SafetyStatus = 'safe' | 'warning' | 'danger';

export const getSafetyColor = (status: SafetyStatus) => ({
  bg: Colors[`${status}Bg` as keyof typeof Colors],
  border: Colors[`${status}Border` as keyof typeof Colors],
  color: Colors[status],
});
