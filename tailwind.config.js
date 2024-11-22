import { nextui } from '@nextui-org/react';

export default {
  content: ['./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            foreground: '#000000',
            background: '#F5F5F5',
          },
        },
        dark: {
          colors: {
            foreground: '#ffffff',
            background: '#30303D',
          },
        },
      },
    }),
  ],
};
