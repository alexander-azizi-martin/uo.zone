const plugin = require('tailwindcss/plugin');

const gradeGradient = [
  { color: '#ff0000', offset: 0 },
  { color: '#ec6c17', offset: 40 },
  { color: '#e89029', offset: 50 },
  { color: '#ecc94b', offset: 65 },
  { color: '#ecc94b', offset: 80 },
  { color: '#c0c246', offset: 85 },
  { color: '#93ba41', offset: 90 },
  { color: '#38a169', offset: 95 },
  { color: '#38a169', offset: 100 },
];

function createGradient(gradientData) {
  const gradientColors = gradientData
    .map(({ color, offset }) => `${color} ${offset}%`)
    .join(',');

  return `linear-gradient(to right, ${gradientColors})`;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        geegee: 'hsl(var(--geegee))',
        'geegee-light': 'hsl(var(--geegee-light))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        inter: 'var(--font-inter)',
        plex: 'var(--font-plex)',
      },
      fontSize: {
        '3xs': ['0.5rem', '0.5rem'],
        '2xs': ['0.625rem', '0.75rem'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      minHeight: {
        'search-nav-body': 'calc(100vh - theme(spacing.8) - 40px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.35s ease-out',
        'accordion-up': 'accordion-up 0.35s ease-out',
        'collapsible-down': 'collapsible-down 0.35s ease-out',
        'collapsible-up': 'collapsible-up 0.35s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height);' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height);' },
          to: { height: '0' },
        },
      },
      backgroundImage: {
        'grades-gradient': createGradient(gradeGradient),
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
    plugin(function ({ addVariant }) {
      addVariant(
        'preventable-hover',
        '&:hover:not(:has(.prevent-hover:hover))',
      );
    }),
  ],
};
