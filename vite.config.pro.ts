import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~(.*)$/,
        replacement: '$1',
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/rc/global-variable.scss";`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
  },
  define: {
    global: 'window',
    CSS_PREFIX: JSON.stringify('osspr-'),
  },
});
