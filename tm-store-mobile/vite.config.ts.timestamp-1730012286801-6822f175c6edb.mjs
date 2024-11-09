// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/unplugin-auto-import/dist/vite.js";
import { VantResolver } from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/unplugin-icons/dist/vite.js";
import { FileSystemIconLoader } from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/unplugin-icons/dist/loaders.js";
import IconsResolver from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/unplugin-icons/dist/resolver.js";
import mockDevServerPlugin from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite-plugin-mock-dev-server/dist/index.js";
import vueSetupExtend from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import viteCompression from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite-plugin-compression/dist/index.mjs";
import { createHtmlPlugin } from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite-plugin-html/dist/index.mjs";

// build/cdn.ts
import { cdn } from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite-plugin-cdn2/dist/index.mjs";
import { unpkg } from "file:///D:/applications/tm-store/tm-store-mobile/node_modules/vite-plugin-cdn2/dist/resolver/unpkg.mjs";
function enableCDN(isEnabled) {
  if (isEnabled === "true") {
    return cdn({
      resolve: unpkg(),
      modules: ["vue", "vue-demi", "pinia", "axios", "vant", "vue-router"]
    });
  }
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/applications/tm-store/tm-store-mobile/vite.config.ts";
var root = process.cwd();
var vite_config_default = defineConfig(({ mode }) => {
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
          "vue",
          "vue-router",
          "pinia",
          "@vueuse/core",
          "vue-i18n"
        ],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/typings/auto-imports.d.ts",
        dirs: ["src/composables"]
      }),
      // vant 组件自动按需引入
      Components({
        dts: "src/typings/components.d.ts",
        resolvers: [
          IconsResolver({
            prefix: false,
            customCollections: ["svg"]
          }),
          VantResolver()
        ]
      }),
      // auto import iconify's icons
      Icons({
        defaultStyle: "display:inline-block",
        compiler: "vue3",
        customCollections: {
          "svg-icons": FileSystemIconLoader(
            "src/assets/svg-icons",
            (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
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
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      open: false,
      host: true,
      port: 8e3,
      hmr: false,
      proxy: {
        "/api": {
          // target: 'https://tm-store-api.herokuapp.com',
          target: "http://localhost:8080",
          // pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: true,
          ws: false
        }
      },
      headers: {
        "Cross-Origin-Embedder-Policy": "unsafe-none"
        // added this part
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvY2RuLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYXBwbGljYXRpb25zXFxcXHRtLXN0b3JlXFxcXHRtLXN0b3JlLW1vYmlsZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYXBwbGljYXRpb25zXFxcXHRtLXN0b3JlXFxcXHRtLXN0b3JlLW1vYmlsZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYXBwbGljYXRpb25zL3RtLXN0b3JlL3RtLXN0b3JlLW1vYmlsZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJub2RlOnVybFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xyXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcclxuaW1wb3J0IHsgRmlsZVN5c3RlbUljb25Mb2FkZXIgfSBmcm9tICd1bnBsdWdpbi1pY29ucy9sb2FkZXJzJ1xyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4taWNvbnNcclxuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXHJcbmltcG9ydCBtb2NrRGV2U2VydmVyUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1tb2NrLWRldi1zZXJ2ZXJcIjtcclxuaW1wb3J0IHZ1ZVNldHVwRXh0ZW5kIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kXCI7XHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xyXG5pbXBvcnQgeyBlbmFibGVDRE4gfSBmcm9tIFwiLi9idWlsZC9jZG5cIjtcclxuXHJcbi8vIFx1NUY1M1x1NTI0RFx1NURFNVx1NEY1Q1x1NzZFRVx1NUY1NVx1OERFRlx1NUY4NFxyXG5jb25zdCByb290OiBzdHJpbmcgPSBwcm9jZXNzLmN3ZCgpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIC8vIFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlxyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdCwgXCJcIik7XHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6IGVudi5WSVRFX0FQUF9QVUJMSUNfUEFUSCB8fCBcIi9cIixcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICBtb2NrRGV2U2VydmVyUGx1Z2luKCksXHJcbiAgICAgIC8vIGF1dG8gaW1wb3J0IGFwaSBvZiBsaWJcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAncGluaWEnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgICAndnVlLWkxOG4nXHJcbiAgICAgICAgXSxcclxuICAgICAgICBpbmNsdWRlOiBbL1xcLlt0al1zeD8kLywgL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBpbmdzL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgICBkaXJzOiBbJ3NyYy9jb21wb3NhYmxlcyddXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyB2YW50IFx1N0VDNFx1NEVGNlx1ODFFQVx1NTJBOFx1NjMwOVx1OTcwMFx1NUYxNVx1NTE2NVxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICBkdHM6IFwic3JjL3R5cGluZ3MvY29tcG9uZW50cy5kLnRzXCIsXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiBmYWxzZSxcclxuICAgICAgICAgICAgY3VzdG9tQ29sbGVjdGlvbnM6IFsnc3ZnJ11cclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgVmFudFJlc29sdmVyKClcclxuICAgICAgICBdXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gYXV0byBpbXBvcnQgaWNvbmlmeSdzIGljb25zXHJcbiAgICAgIEljb25zKHtcclxuICAgICAgICBkZWZhdWx0U3R5bGU6ICdkaXNwbGF5OmlubGluZS1ibG9jaycsXHJcbiAgICAgICAgY29tcGlsZXI6ICd2dWUzJyxcclxuICAgICAgICBjdXN0b21Db2xsZWN0aW9uczoge1xyXG4gICAgICAgICAgJ3N2Zy1pY29ucyc6IEZpbGVTeXN0ZW1JY29uTG9hZGVyKCdzcmMvYXNzZXRzL3N2Zy1pY29ucycsIChzdmcpID0+XHJcbiAgICAgICAgICAgIHN2Zy5yZXBsYWNlKC9ePHN2ZyAvLCAnPHN2ZyBmaWxsPVwiY3VycmVudENvbG9yXCIgd2lkdGg9XCIxLjJlbVwiIGhlaWdodD1cIjEuMmVtXCInKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICAgIC8vIC8vIHN2ZyBpY29uXHJcbiAgICAgIC8vIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgLy8gICAvLyBcdTYzMDdcdTVCOUFcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcclxuICAgICAgLy8gICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShyb290LCBcInNyYy9pY29ucy9zdmdcIildLFxyXG4gICAgICAvLyAgIC8vIFx1NjMwN1x1NUI5QSBzeW1ib2xJZCBcdTY4M0NcdTVGMEZcclxuICAgICAgLy8gICBzeW1ib2xJZDogXCJpY29uLVtkaXJdLVtuYW1lXVwiXHJcbiAgICAgIC8vIH0pLFxyXG4gICAgICAvLyBcdTUxNDFcdThCQjggc2V0dXAgXHU4QkVEXHU2Q0Q1XHU3Q0Q2XHU0RTBBXHU2REZCXHU1MkEwXHU3RUM0XHU0RUY2XHU1NDBEXHU1QzVFXHU2MDI3XHJcbiAgICAgIHZ1ZVNldHVwRXh0ZW5kKCksXHJcbiAgICAgIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4MyBnemlwIFx1NTM4Qlx1N0YyOVx1OEQ0NFx1NkU5MFxyXG4gICAgICB2aXRlQ29tcHJlc3Npb24oKSxcclxuICAgICAgLy8gXHU2Q0U4XHU1MTY1XHU2QTIxXHU2NzdGXHU2NTcwXHU2MzZFXHJcbiAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICAgIGluamVjdDoge1xyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBFTkFCTEVfRVJVREE6IGVudi5WSVRFX0VOQUJMRV9FUlVEQSB8fCBcImZhbHNlXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTlFRDhcdThCQTRcdTRFMERcdTU0MkZcdTc1MjggQ0ROIFx1NTJBMFx1OTAxRlxyXG4gICAgICBlbmFibGVDRE4oZW52LlZJVEVfQ0ROX0RFUFMpXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIG9wZW46IGZhbHNlLFxyXG4gICAgICBob3N0OiB0cnVlLFxyXG4gICAgICBwb3J0OiA4MDAwLFxyXG4gICAgICBobXI6IGZhbHNlLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cHM6Ly90bS1zdG9yZS1hcGkuaGVyb2t1YXBwLmNvbScsXHJcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICAgICAgLy8gcGF0aFJld3JpdGU6IHsgJ14vYXBpJzogJycgfSxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcclxuICAgICAgICAgIHdzOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIFwiQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeVwiOiBcInVuc2FmZS1ub25lXCIsIC8vIGFkZGVkIHRoaXMgcGFydFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBcInN0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwic3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF1cIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFwcGxpY2F0aW9uc1xcXFx0bS1zdG9yZVxcXFx0bS1zdG9yZS1tb2JpbGVcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFwcGxpY2F0aW9uc1xcXFx0bS1zdG9yZVxcXFx0bS1zdG9yZS1tb2JpbGVcXFxcYnVpbGRcXFxcY2RuLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9hcHBsaWNhdGlvbnMvdG0tc3RvcmUvdG0tc3RvcmUtbW9iaWxlL2J1aWxkL2Nkbi50c1wiO2ltcG9ydCB7IGNkbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1jZG4yXCI7XHJcbmltcG9ydCB7IHVucGtnIH0gZnJvbSBcInZpdGUtcGx1Z2luLWNkbjIvcmVzb2x2ZXIvdW5wa2dcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVDRE4oaXNFbmFibGVkOiBzdHJpbmcpIHtcclxuICBpZiAoaXNFbmFibGVkID09PSBcInRydWVcIikge1xyXG4gICAgcmV0dXJuIGNkbih7XHJcbiAgICAgIHJlc29sdmU6IHVucGtnKCksXHJcbiAgICAgIG1vZHVsZXM6IFtcInZ1ZVwiLCBcInZ1ZS1kZW1pXCIsIFwicGluaWFcIiwgXCJheGlvc1wiLCBcInZhbnRcIiwgXCJ2dWUtcm91dGVyXCJdXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVCxTQUFTLGVBQWUsV0FBVztBQUNyVixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBRTdCLE9BQU8sV0FBVztBQUNsQixTQUFTLDRCQUE0QjtBQUVyQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLHlCQUF5QjtBQUNoQyxPQUFPLG9CQUFvQjtBQUMzQixPQUFPLHFCQUFxQjtBQUM1QixTQUFTLHdCQUF3Qjs7O0FDZnFSLFNBQVMsV0FBVztBQUMxVSxTQUFTLGFBQWE7QUFFZixTQUFTLFVBQVUsV0FBbUI7QUFDM0MsTUFBSSxjQUFjLFFBQVE7QUFDeEIsV0FBTyxJQUFJO0FBQUEsTUFDVCxTQUFTLE1BQU07QUFBQSxNQUNmLFNBQVMsQ0FBQyxPQUFPLFlBQVksU0FBUyxTQUFTLFFBQVEsWUFBWTtBQUFBLElBQ3JFLENBQUM7QUFBQSxFQUNIO0FBQ0Y7OztBRFYrTCxJQUFNLDJDQUEyQztBQW1CaFAsSUFBTSxPQUFlLFFBQVEsSUFBSTtBQUdqQyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLE1BQU0sRUFBRTtBQUNsQyxTQUFPO0FBQUEsSUFDTCxNQUFNLElBQUksd0JBQXdCO0FBQUEsSUFDbEMsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1Asb0JBQW9CO0FBQUE7QUFBQSxNQUVwQixXQUFXO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsUUFDQSxTQUFTLENBQUMsY0FBYyxVQUFVLGNBQWMsT0FBTztBQUFBLFFBQ3ZELEtBQUs7QUFBQSxRQUNMLE1BQU0sQ0FBQyxpQkFBaUI7QUFBQSxNQUMxQixDQUFDO0FBQUE7QUFBQSxNQUVELFdBQVc7QUFBQSxRQUNULEtBQUs7QUFBQSxRQUNMLFdBQVc7QUFBQSxVQUNULGNBQWM7QUFBQSxZQUNaLFFBQVE7QUFBQSxZQUNSLG1CQUFtQixDQUFDLEtBQUs7QUFBQSxVQUMzQixDQUFDO0FBQUEsVUFDRCxhQUFhO0FBQUEsUUFDZjtBQUFBLE1BQ0YsQ0FBQztBQUFBO0FBQUEsTUFHRCxNQUFNO0FBQUEsUUFDSixjQUFjO0FBQUEsUUFDZCxVQUFVO0FBQUEsUUFDVixtQkFBbUI7QUFBQSxVQUNqQixhQUFhO0FBQUEsWUFBcUI7QUFBQSxZQUF3QixDQUFDLFFBQ3pELElBQUksUUFBUSxVQUFVLHVEQUF1RDtBQUFBLFVBQy9FO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVNELGVBQWU7QUFBQTtBQUFBLE1BRWYsZ0JBQWdCO0FBQUE7QUFBQSxNQUVoQixpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxVQUNOLE1BQU07QUFBQSxZQUNKLGNBQWMsSUFBSSxxQkFBcUI7QUFBQSxVQUN6QztBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQTtBQUFBLE1BRUQsVUFBVSxJQUFJLGFBQWE7QUFBQSxJQUM3QjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLEtBQUs7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQTtBQUFBLFVBRU4sUUFBUTtBQUFBO0FBQUEsVUFFUixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixJQUFJO0FBQUEsUUFDTjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLGdDQUFnQztBQUFBO0FBQUEsTUFDbEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
