import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from "unplugin-vue-components/resolvers";
// import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
// https://github.com/antfu/unplugin-icons
import IconsResolver from 'unplugin-icons/resolver'
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { enableCDN } from "./build/cdn";

// 当前工作目录路径
const root: string = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, root, "");
  return {
    base: env.VITE_APP_PUBLIC_PATH || "/",
    plugins: [
      vue(),
      vueJsx(),
      mockDevServerPlugin(),
      // auto import api of lib
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          'vue-i18n'
        ],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/typings/auto-imports.d.ts'
      }),
      // vant 组件自动按需引入
      Components({
        dts: "src/typings/components.d.ts",
        resolvers: [
          IconsResolver({
            prefix: false,
            customCollections: ['svg']
          }),
          VantResolver()
        ]
      }),

      // auto import iconify's icons
      Icons({
        defaultStyle: 'display:inline-block',
        compiler: 'vue3',
        customCollections: {
          'svg-icons': FileSystemIconLoader('src/assets/svg-icons', (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
          )
        }
      }),
      // // svg icon
      // createSvgIconsPlugin({
      //   // 指定图标文件夹
      //   iconDirs: [path.resolve(root, "src/icons/svg")],
      //   // 指定 symbolId 格式
      //   symbolId: "icon-[dir]-[name]"
      // }),
      // 允许 setup 语法糖上添加组件名属性
      vueSetupExtend(),
      // 生产环境 gzip 压缩资源
      viteCompression(),
      // 注入模板数据
      createHtmlPlugin({
        inject: {
          data: {
            ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || "false"
          }
        }
      }),
      // 生产环境默认不启用 CDN 加速
      enableCDN(env.VITE_CDN_DEPS)
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
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
  };
});
