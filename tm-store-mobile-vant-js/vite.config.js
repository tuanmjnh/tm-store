import { defineConfig } from 'vite'
import path from 'node:path'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"
import { VantResolver } from "@vant/auto-import-resolver"

// https://vitejs.dev/config/
// export default defineConfig({


export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return {
    base: env.VITE_APP_ROUTER_BASE || "/",
    // Cli
    define: {
      // 'process.env.VUE_APP_API_BASE_URL': JSON.stringify(env.VITE_APP_API),
      // 'process.env.VUE_APP_PUBLIC_PATH': JSON.stringify(env.VITE_APP_PUBLIC_PATH),
    },
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      })
    ],
    resolve: {
      alias: {
        '/src': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
      },
    },
    server: {
      // Disable automatic dev server on project open ?
      // https://vitejs.dev/config/#server-open
      open: false,
      host: true,
      port: 8000,
      hmr: false,
      proxy: {
        '/api': {
          // target: 'https://tm-store-api.herokuapp.com',
          target: 'http://localhost:8080',
          // pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: true,
          ws: false
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  }
})
