import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import macrosPlugin from "vite-plugin-babel-macros";

export default defineConfig({
  plugins: [react(), macrosPlugin()],
  server: {
    historyApiFallback: true, // Chỉ có tác dụng khi chạy `vite dev`
  },
  build: {
    outDir: 'dist', // Thư mục chứa file build
  },
  resolve: {
    alias: {
      '@': '/src', // Định nghĩa alias cho src
    },
  },
  base: '/', // Thư mục gốc của project
  define: {
    'process.env': process.env,
  },
});
