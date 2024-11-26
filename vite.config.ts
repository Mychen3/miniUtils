import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';
import { join } from 'path';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
export default defineConfig({
  resolve: {
    alias: {
      '@src': join(__dirname, 'src/'),
      '@pages': join(__dirname, 'src/renderer/pages'),
      '@hooks': join(__dirname, 'src/renderer/hooks'),
      '@utils': join(__dirname, 'src/utils'),
      '@const': join(__dirname, 'src/common/constants'),
      '@assets': join(__dirname, 'src/assets'),
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
    Icons({
      customCollections: {
        mySvg: FileSystemIconLoader('src/assets/svg'),
      },
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
});
