import { StyleSheet } from "react-native";

export const theme = {
  colors: {
    // Brand
    primary: "#3e76d8",
    primaryDark: "#3e76d8",
    primarySurface: "#254598",
    primaryLight: "#6b9cf2",
    primarySubtle: "#eff6ff",

    secondary: "#7c3aed", // Added for "Popular" badge
    secondarySubtle: "#f5f3ff", // Added for "Popular" badge

    // Backgrounds
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#F5F7FB",

    // Text
    textPrimary: "#14275a",
    textSecondary: "#545d79",
    textMuted: "#94A3B8",

    // Borders
    border: "#E5E9F2",
    divider: "#E5E9F2",
    borderLight: "#F1F5F9", // Added for card borders

    // Semantic
    success: "#22C55E",
    successSubtle: "#F0FDF4",

    warning: "#F59E0B",
    warningSubtle: "#FFFBEB",

    error: "#EF4444",
    errorSubtle: "#FEF2F2",

    // Utility
    overlay: "rgba(0,0,0,0.5)",
    shadow: "#000000",
    rating: "#FACC15",

    // iOS HIG system palette (light mode). Use these for iOS-native surfaces.
    ios: {
      systemBackground: "#FFFFFF",
      secondarySystemBackground: "#F2F2F7",
      tertiarySystemBackground: "#FFFFFF",
      systemGroupedBackground: "#F2F2F7",
      secondarySystemGroupedBackground: "#FFFFFF",

      separator: "rgba(60,60,67,0.29)",
      separatorOpaque: "#C6C6C8",

      label: "#000000",
      secondaryLabel: "rgba(60,60,67,0.6)",
      tertiaryLabel: "rgba(60,60,67,0.3)",
      quaternaryLabel: "rgba(60,60,67,0.18)",

      fill: "rgba(120,120,128,0.2)",
      secondaryFill: "rgba(120,120,128,0.16)",
      tertiaryFill: "rgba(118,118,128,0.12)",

      link: "#007AFF",
      blue: "#007AFF",
      destructive: "#FF3B30",
      success: "#34C759",
      warning: "#FF9500",
      orange: "#FF9500",
      yellow: "#FFCC00",
      green: "#34C759",
      indigo: "#5856D6",
      purple: "#AF52DE",
      pink: "#FF2D55",
      teal: "#5AC8FA",
    },
  },

  fonts: {
    heading: "System", // Map to your custom font name if using Expo Font
    subheading: "System",
    body: "System",
    bodyMedium: "System",
  },
  typography: {
    h1: { fontSize: 24, fontWeight: "700" as const },
    h2: { fontSize: 20, fontWeight: "600" as const },
    h3: { fontSize: 18, fontWeight: "600" as const },
    body: { fontSize: 16, fontWeight: "400" as const },
    bodyMedium: { fontSize: 16, fontWeight: "500" as const },
    caption: { fontSize: 12, fontWeight: "400" as const },
    button: { fontSize: 14, fontWeight: "500" as const },

    // Apple HIG text styles — use these on new iOS-native screens.
    ios: {
      largeTitle: { fontSize: 34, fontWeight: "700" as const, letterSpacing: 0.37 },
      title1:     { fontSize: 28, fontWeight: "700" as const, letterSpacing: 0.36 },
      title2:     { fontSize: 22, fontWeight: "700" as const, letterSpacing: 0.35 },
      title3:     { fontSize: 20, fontWeight: "600" as const, letterSpacing: 0.38 },
      headline:   { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.41 },
      body:       { fontSize: 17, fontWeight: "400" as const, letterSpacing: -0.41 },
      callout:    { fontSize: 16, fontWeight: "400" as const, letterSpacing: -0.32 },
      subhead:    { fontSize: 15, fontWeight: "400" as const, letterSpacing: -0.24 },
      footnote:   { fontSize: 13, fontWeight: "400" as const, letterSpacing: -0.08 },
      caption1:   { fontSize: 12, fontWeight: "400" as const, letterSpacing: 0 },
      caption2:   { fontSize: 11, fontWeight: "400" as const, letterSpacing: 0.07 },
    },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  radius: { sm: 6, md: 10, lg: 14, xl: 20, full: 999 },
  shadows: {
    small: {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // Sub-pixel hairline on iOS; 1pt on Android.
  hairline: StyleSheet.hairlineWidth,

  // Motion tokens for Reanimated. Spring configs feel native on iOS.
  motion: {
    // Standard page / sheet motion.
    spring: { damping: 18, stiffness: 180, mass: 1 },
    // Snappy button / tap response — short, crisp.
    snappy: { damping: 22, stiffness: 320, mass: 1 },
    // Slow & gentle — good for large elements fading in.
    gentle: { damping: 20, stiffness: 120, mass: 1 },
    // Timing presets for simple fades.
    timing: { short: 150, standard: 220, long: 320 },
  },
};
