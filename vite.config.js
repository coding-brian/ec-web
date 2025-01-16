import { fileURLToPath, URL } from 'node:url'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// 加載環境專屬的 .env 文件
const envFile = `.env.${process.env.NODE_ENV}`
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

// 手動加載 .env 文件
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'process.env': process.env,
  },
})
