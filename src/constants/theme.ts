export const theme = {
  colors: {
    primary: '#a9978b',
    primaryLight: '#bfb1a6',
    primaryDark: '#8b7d70',
    white: '#ffffff',
    background: '#ffffff',
    surface: '#ffffff',
    text: {
      primary: '#2c2c2c',
      secondary: '#666666',
      muted: '#999999',
      light: '#cccccc',
    },
    border: {
      light: '#f0f0f0',
      default: '#e0e0e0',
      primary: '#a9978b',
    },
    accent: '#a9978b',
    error: '#d32f2f',
    success: '#388e3c',
    warning: '#f57c00',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 30,
    },
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
};

export type Theme = typeof theme;