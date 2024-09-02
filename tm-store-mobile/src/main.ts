import { createApp } from "vue";
import { i18n } from './i18n'
import { installRouter } from '@/router'
import { installPinia } from '@/store'
import AppVue from './App.vue'
import AppLoading from './components/common/AppLoading.vue'
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.scss";
// tailwindcss
import "./styles/tailwind.css";
// svg icon
// import "virtual:svg-icons-register";

async function setupApp() {
  // Load the global loading status
  const appLoading = createApp(AppLoading)
  appLoading.mount('#appLoading')

  // Create a Vue instance
  const app = createApp(AppVue)

  // Registration module Pinia
  await installPinia(app)

  // Register Module Vue-router
  await installRouter(app)

  //
  app.use(i18n);

  // Register module directive/static resource
  // Object.values(import.meta.glob<{ install: (app: App) => void }>('./modules/*.ts', { eager: true })).map(i => app.use(i))

  // Unloading animation
  appLoading.unmount()

  // Mount
  app.mount('#app')
}

setupApp()

// const app = createApp(App);
// app.use(i18n);
// app.use(store);
// app.use(router);

// app.mount("#app");
