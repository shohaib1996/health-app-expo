/** @type {import('tailwindcss').Config} */
// Values mirror src/design/tokens.ts. Tailwind's config loader is plain
// CJS and can't import the TS/ESM token module directly, so the raw
// values are restated here. Keep both in sync if the tokens change.

const colors = {
  bg: '#161826',
  surface: '#232532',
  text: '#e9e9ed',
  divider: 'rgba(233, 233, 237, 0.16)',
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
};

const px = (n) => `${n}px`;
const heading = (fontSize, lh = 1.12) => ({
  fontSize,
  lineHeight: Math.round(fontSize * lh),
  letterSpacing: -0.015 * fontSize,
});

const type = {
  h1: heading(42),
  h2: heading(32),
  h3: heading(25),
  h4: heading(20),
  h5: heading(16),
  h6: { ...heading(13), letterSpacing: 0.08 * 13 },
  hero: { fontSize: 60, lineHeight: 60, letterSpacing: -0.02 * 60 },
  body: { fontSize: 15, lineHeight: Math.round(15 * 1.55) },
  bodySmall: { fontSize: 13, lineHeight: Math.round(13 * 1.5) },
  caption: { fontSize: 11, lineHeight: Math.round(11 * 1.4) },
};

const spacing = { 1: 2.8, 2: 5.6, 3: 8.4, 4: 11.2, 6: 16.8, 8: 22.4 };
const radius = { default: 4, checkbox: 2, pill: 9999, avatar: 9999 };

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        surface: colors.surface,
        text: colors.text,
        divider: colors.divider,
        accent: { DEFAULT: colors.accent, ...colors.accentRamp },
        neutral: colors.neutralRamp,
      },
      fontFamily: {
        heading: ['Inter_500Medium'],
        body: ['Inter_400Regular'],
      },
      fontSize: {
        h1: [px(type.h1.fontSize), { lineHeight: px(type.h1.lineHeight), letterSpacing: px(type.h1.letterSpacing) }],
        h2: [px(type.h2.fontSize), { lineHeight: px(type.h2.lineHeight), letterSpacing: px(type.h2.letterSpacing) }],
        h3: [px(type.h3.fontSize), { lineHeight: px(type.h3.lineHeight), letterSpacing: px(type.h3.letterSpacing) }],
        h4: [px(type.h4.fontSize), { lineHeight: px(type.h4.lineHeight), letterSpacing: px(type.h4.letterSpacing) }],
        h5: [px(type.h5.fontSize), { lineHeight: px(type.h5.lineHeight), letterSpacing: px(type.h5.letterSpacing) }],
        h6: [px(type.h6.fontSize), { lineHeight: px(type.h6.lineHeight), letterSpacing: px(type.h6.letterSpacing) }],
        hero: [px(type.hero.fontSize), { lineHeight: px(type.hero.lineHeight), letterSpacing: px(type.hero.letterSpacing) }],
        body: [px(type.body.fontSize), { lineHeight: px(type.body.lineHeight) }],
        'body-sm': [px(type.bodySmall.fontSize), { lineHeight: px(type.bodySmall.lineHeight) }],
        caption: [px(type.caption.fontSize), { lineHeight: px(type.caption.lineHeight) }],
      },
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, px(v)])),
      borderRadius: {
        default: px(radius.default),
        checkbox: px(radius.checkbox),
        pill: px(radius.pill),
        avatar: px(radius.avatar),
      },
    },
  },
  plugins: [],
};
