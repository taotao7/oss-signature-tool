import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  define: {
    global: 'window',
  },
  build: {
    lib: {
      entry: resolvePath('src/index.ts'),
      name: 'signature-tool',
      fileName: (format) => `signature-tool.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'moment'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'reactDom',
          moment: 'moment',
        },
      },
    },
    outDir: 'dist',
  },
});
