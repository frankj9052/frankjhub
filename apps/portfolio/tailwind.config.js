const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { heroui } = require('@heroui/react');

// The above utility import will not work if you are using Next.js' --turbo.
// Instead you will have to manually add the dependent paths to be included.
// For example
// ../libs/buttons/**/*.{ts,tsx,js,jsx,html}',                 <--- Adding a shared lib
// !../libs/buttons/**/*.{stories,spec}.{ts,tsx,js,jsx,html}', <--- Skip adding spec/stories files from shared lib

// If you are **not** using `--turbo` you can uncomment both lines 1 & 19.
// A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'color-input-border': '#B5B5B5',
        'color-text-black': '#0e2431',
        'color-text-gray': '#777',
        'color-line': '#d7d7d7',
      },
      fontFamily: {
        popins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      height: {
        'vertical-center': 'calc(100vh - 80px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        'portfolio-theme': {
          extend: 'light',
          colors: {
            primary: {
              DEFAULT: '#6a59d1',
            },
          },
        },
      },
    }),
  ],
};
