import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';

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
      entry: resolvePath('src/rc/index.tsx'),
      name: 'signature-tool',
      fileName: (format) => `signature-tool.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@alicloud/console-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'reactDom',
          '@alicloud/console-components': 'consoleComponents',
        },
      },
      plugins: [
        typescript({
          target: 'es2015',
          rootDir: resolvePath('src/rc/index.tsx'),
          declaration: true,
          declarationDir: resolvePath('lib/dist/types'),
          exclude: resolvePath('node_modules/**'),
          allowSyntheticDefaultImports: true,
        }),
      ],
    },
    outDir: 'lib/dist',
  },
});
