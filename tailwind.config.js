import { nextui } from '@nextui-org/react';

export default {
  content: ['./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'theme',
      themes: {
        light: {
          colors: {
            foreground: '#000000',
            background: '#F5F5F5',
            content5: '#FFFFFF',
            content6: '#FFFFFF',
          },
        },
        dark: {
          colors: {
            foreground: '#ffffff',
            background: '#30303D',
            content5: '#1E1F27',
            content6: '#282A36',
          },
        },
      },
    }),
  ],
};
