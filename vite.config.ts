import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  define: {
    global: 'window',
  },
  // build: {
  //     lib: {
  //         entry: resolve(__dirname, 'src/rc/index.tsx'),
  //         name: 'ossSignatureTool',
  //         fileName: 'index',
  //     },
  //     rollupOptions: {
  //         external: ["react", "react-dom"],
  //         output: {
  //             globals: {
  //                 react: 'react',
  //                 'react-dom': 'react-dom',
  //             },
  //         },
  //     },
  // }
});
