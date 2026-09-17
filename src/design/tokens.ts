/**
 * Nocturne design tokens — React Native.
 * Plain objects, no dependencies (no NativeWind/StyleSheet coupling).
 *
 * DARK-ONLY: Nocturne has no light theme today — the system is built as a
 * single dark ground (see design-system guide: "a quiet, compact dark
 * interface"). Rather than fork colors into theme.dark / theme.light now
 * (which would invent a light palette that doesn't exist and could drift
 * from the real one later), this file exports the flat `colors` object
 * Nocturne actually has today, plus a `themes` wrapper with a single
 * `dark` key. That shape means adding `themes.light` later is additive —
 * no call site that already reads `theme.colors.x` has to change — without
 * pretending a light theme exists now.
 */

export const colors = {
  bg: '#161826',
  surface: '#232532',
  text: '#e9e9ed',
  divider: 'rgba(233, 233, 237, 0.16)', // color-mix(text 16%, transparent)

  // Accent — the one semantic reward color. Never a button fill, never
  // ornament. Meaning is fixed: "the data supports this."
  accent: '#9184d9',
  accentRamp: {
    100: '#f5f4ff',
    200: '#e7e5fe',
    300: '#d2cefd',
    400: '#b5abfc',
    500: '#968ae0',
    600: '#796cbf',
    700: '#5d5294',
    800: '#423a6a',
    900: '#2b2741',
  },

  // Neutral ramp — surfaces, chrome, nav, body text, and the two other
  // confidence tokens (neutral300 = tested/no effect, neutral500 = not
  // enough data). Same perceptual-lightness scale as the accent ramp.
  neutralRamp: {
    100: '#f3f5fe',
    200: '#e4e7f5',
    300: '#cfd3e5',
    400: '#b2b6ca',
    500: '#9397ab',
    600: '#75798c',
    700: '#595d6c',
    800: '#3f424d',
    900: '#292b31',
  },
} as const;

/** Confidence-token semantics — never used for decoration. */
export const confidence = {
  supported: colors.accent, // the data supports this
  noEffect: colors.neutralRamp[300], // tested, no real effect
  insufficientData: colors.neutralRamp[500], // not enough data to test
} as const;

export const themes = {
  dark: {
    colors,
  },
  // light: undefined — no light theme exists in Nocturne yet.
} as const;

export type ThemeName = keyof typeof themes;

// ---------------------------------------------------------------------------
// Type scale — Inter, headings at weight 500 (never bolder; hierarchy is
// size and space, not weight). Line heights as unitless multipliers, matching
// the web system's line-height/letter-spacing.
// ---------------------------------------------------------------------------

export const fontFamily = {
  heading: 'Inter',
  body: 'Inter',
} as const;

type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '500';
  lineHeight: number; // absolute px, RN wants resolved line-height
  letterSpacing: number;
};

function heading(fontSize: number, lineHeightMultiplier = 1.12): TypeStyle {
  return {
    fontFamily: fontFamily.heading,
    fontSize,
    fontWeight: '500',
    lineHeight: Math.round(fontSize * lineHeightMultiplier),
    letterSpacing: -0.015 * fontSize,
  };
}

export const typeScale = {
  h1: heading(42),
  h2: heading(32),
  h3: heading(25),
  h4: heading(20),
  h5: heading(16),
  h6: {
    ...heading(13),
    letterSpacing: 0.08 * 13,
  },
  // Hero number slot — display-weight numerals, larger than any heading.
  // Not in the web system's h-scale because it's a component, not prose.
  hero: {
    fontFamily: fontFamily.heading,
    fontSize: 60,
    fontWeight: '500' as const,
    lineHeight: 60,
    letterSpacing: -0.02 * 60,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: Math.round(15 * 1.55),
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: Math.round(13 * 1.5),
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: Math.round(11 * 1.4),
    letterSpacing: 0,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing — density 0.7×, matching the web system's --space-* scale.
// ---------------------------------------------------------------------------

export const spacing = {
  1: 2.8,
  2: 5.6,
  3: 8.4,
  4: 11.2,
  6: 16.8,
  8: 22.4,
} as const;

// ---------------------------------------------------------------------------
// Radius — single token, referenced everywhere. Web system ships three
// sizes (sm/md/lg); product-level UI (per the S-24 geometry rules) standardizes
// on 4px for controls, cards, and overlays. Keep `radius.default` as the one
// value components read; `scale` is here only for parity with the web tokens.
// ---------------------------------------------------------------------------

export const radius = {
  default: 4, // buttons, inputs, cards, modals, chips, tooltips, toasts — always this
  checkbox: 2,
  pill: 9999, // progress bars, sliders — always fully rounded
  avatar: 9999, // avatars — always fully round
  scale: {
    sm: 4,
    md: 8,
    lg: 14,
  },
} as const;

// ---------------------------------------------------------------------------
// Elevation — hairline edge + ambient darkness (this ground has no soft
// light-theme shadow). Kept as RN-shaped shadow props, iOS + Android split.
// ---------------------------------------------------------------------------

export const elevation = {
  sm: {
    borderWidth: 1,
    borderColor: colors.neutralRamp[800],
  },
  md: {
    borderWidth: 1,
    borderColor: colors.neutralRamp[700],
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6, // Android
  },
  lg: {
    borderWidth: 1,
    borderColor: colors.neutralRamp[500],
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 16 },
    elevation: 16, // Android
  },
} as const;
