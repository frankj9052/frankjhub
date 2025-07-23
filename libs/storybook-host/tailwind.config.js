const { heroui } = require('@heroui/react');
const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ...createGlobPatternsForDependencies(__dirname),
    '../shared-ui-core/src/lib/**/*!(*.stories|*.spec).{ts,tsx,html}',
    '../shared-ui-client/src/lib/**/*!(*.stories|*.spec).{ts,tsx,html}',
    '../shared-ui-chadcn/src/lib/**/*!(*.stories|*.spec).{ts,tsx,html}',
    '../shared-ui-hero-ssr/src/lib/**/*!(*.stories|*.spec).{ts,tsx,html}',
    '../shared-ui-hero-client/src/lib/**/*!(*.stories|*.spec).{ts,tsx,html}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui(), typography],
};
