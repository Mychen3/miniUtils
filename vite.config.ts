import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@pages': join(__dirname, 'src/renderer/pages'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    react(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],
});
