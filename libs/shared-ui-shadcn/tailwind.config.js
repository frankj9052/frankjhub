const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        // Core UI colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',

        // Actions
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',

        // UI borders / rings
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // Muted text / UI
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
      },
      borderColor: {
        border: 'var(--border)',
      },
      backgroundColor: {
        background: 'var(--background)',
      },
      textColor: {
        foreground: 'var(--foreground)',
      },
      ringColor: {
        ring: 'var(--ring)',
      },
      outlineColor: {
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)', // For `rounded-lg`
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
