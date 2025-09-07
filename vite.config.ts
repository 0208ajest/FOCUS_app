import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages用の相対パス設定
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // 音声ファイルを適切なディレクトリに配置
          if (assetInfo.name && assetInfo.name.endsWith('.mp3')) {
            return 'assets/sounds/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
})
