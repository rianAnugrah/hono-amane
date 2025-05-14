// Design System inspired by Apple's Human Interface Guidelines
// This file contains shared design tokens and utility functions

// Colors
export const colors = {
  // Primary palette
  primary: {
    lightest: '#E3F2FD', // Light blue background
    light: '#90CAF9',    // Light blue
    main: '#2196F3',     // Apple-like blue
    dark: '#1976D2',     // Darker blue
    darkest: '#0D47A1',  // Very dark blue
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    100: '#F5F5F7',      // Apple's light background
    200: '#E5E5EA',      // Light borders
    300: '#D1D1D6',      // Dividers
    400: '#C7C7CC',      // Disabled elements
    500: '#8E8E93',      // Secondary text
    600: '#636366',      // Tertiary text
    700: '#48484A',      // Labels
    800: '#3A3A3C',      // Secondary labels
    900: '#1C1C1E',      // Apple's dark text
    black: '#000000',
  },

  // Feedback colors
  success: {
    light: '#E8F5E9',
    main: '#34C759',     // Apple green
    dark: '#2D9E4B',
  },
  warning: {
    light: '#FFF8E1',
    main: '#FF9500',     // Apple orange
    dark: '#C67500',
  },
  error: {
    light: '#FFEBEE',
    main: '#FF3B30',     // Apple red
    dark: '#C62828',
  },
};

// Typography
export const typography = {
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',   // For pills and circles
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Transitions
export const transitions = {
  default: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Apple-like easing
  slow: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  fast: 'all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Z-index
export const zIndex = {
  0: 0,
  10: 10,      // Base elements
  20: 20,      // Dropdowns
  30: 30,      // Sticky elements
  40: 40,      // Modals and dialogs
  50: 50,      // Toasts and notifications
  auto: 'auto',
}; 